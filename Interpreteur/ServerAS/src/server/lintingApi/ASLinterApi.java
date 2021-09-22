package server.lintingApi;

import com.sun.net.httpserver.HttpExchange;
import interpreteur.as.modules.ASModule;
import interpreteur.as.modules.ASModuleManager;
import interpreteur.as.modules.EnumModule;
import interpreteur.generateurs.lexer.LexerLoader;
import interpreteur.generateurs.lexer.Regle;
import org.json.JSONArray;
import org.json.JSONObject;
import server.BaseApi;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ASLinterApi extends BaseApi {

    private final static ArrayList<Regle> REGLES;
    private static final ASModuleManager MODULE_MANAGER = new ASModuleManager(null);

    static {
        var tmp = new LexerLoader(null);
        tmp.load();
        REGLES = tmp.getReglesAjoutees();
    }

    public ASLinterApi(String CORS_ORIGIN) {
        super(CORS_ORIGIN);
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        super.handle(httpExchange);

        String requestParamValue;

        requestParamValue = switch (httpExchange.getRequestMethod().toUpperCase()) {
            case "GET" -> handleGetRequest(httpExchange);
            case "POST" -> "{}";
            default -> "";
        };
        assert requestParamValue != null;
        handleResponse(httpExchange, requestParamValue);
    }

    private String handleGetRequest(HttpExchange httpExchange) {
        JSONObject linterProperties = new JSONObject();

        // adds all builtin functions
        List<String> fonctionsBuiltins = MODULE_MANAGER.getModuleBuiltins().getNomsConstantesEtFonctions();
        fonctionsBuiltins.remove("afficher");
        fonctionsBuiltins.remove("attendre");
        fonctionsBuiltins = fonctionsBuiltins
                .stream()
                .map(fct -> "\\b" + fct + "\\b")
                .collect(Collectors.toList());

        // adds all the name of the allowed modules
        List<String> modules = Stream.of(EnumModule.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        modules.add("\\b\"experimental\"\\b");

        List<String> commands = getPatternsOfCategory("commandes");
        // adds afficher to the commands and the command in the methode_moteur category
        commands.add("\\bafficher\\b");
        commands.remove("\\bconst\\b");
        commands.addAll(getPatternsOfCategory("methode_moteur"));

        linterProperties
                .put("datatype", Map.ofEntries(getMembersOfCategory("type_de_donnees")
                        .map(regle -> Map.entry(regle.getNom().toLowerCase(), regle.getPattern()))
                        .toArray(Map.Entry[]::new))
                )
                .put("datatypes_names", getPatternsOfCategory("nom_type_de_donnees"))
                .put("modules", modules)
                .put("blocs", getPatternsOfCategory("blocs"))
                .put("commands", commands)
                .put("logiques", new JSONArray(getPatternsOfCategory("porte_logique"))
                        .put(getReglePattern("PAS"))
                )
                .put("fonctions", getPatternsOfCategory("fonctions"))
                .put("fin", getReglePattern("FIN"))
                .put("fonctions_builtin", fonctionsBuiltins)
                .put("control_flow", new JSONArray(getPatternsOfCategory("control_flow")).put("\\bconst\\b"))
                .put("variable", "[a-zA-Z\\\\$_\\u00a1-\\uffff][a-zA-Z\\\\d\\\\$_\\u00a1-\\uffff\\.]*");

        return linterProperties.toString();
    }

    private List<String> getPatternsOfCategory(String nomCategorie) {
        return getMembersOfCategory(nomCategorie).map(Regle::getPattern).collect(Collectors.toList());
    }

    private List<String> getNamesOfCategory(String nomCategorie) {
        return getMembersOfCategory(nomCategorie).map(regle -> regle.getNom().toLowerCase()).collect(Collectors.toList());
    }

    private Stream<Regle> getMembersOfCategory(String nomCategorie) {
        return REGLES.stream().filter(regle -> regle.getCategorie().equals(nomCategorie));
    }

    private String getReglePattern(String regleName) {
        return REGLES.stream().filter(regle -> regle.getNom().equals(regleName)).findFirst().orElseThrow().getPattern();
    }

    private List<String> getMembersOfModule(String moduleName, boolean includeFunction, boolean includeVariables) {
        ArrayList<String> members = new ArrayList<>();
        ASModule module = MODULE_MANAGER.getModule(moduleName);
        if (includeFunction)
            members.addAll(module.getNomsFonctions().stream().map(name -> "\\b" + name + "\\b").collect(Collectors.toList()));
        if (includeVariables)
            members.addAll(module.getNomsVariables().stream().map(name -> "\\b" + name + "\\b").collect(Collectors.toList()));

        return members;
    }
}




















