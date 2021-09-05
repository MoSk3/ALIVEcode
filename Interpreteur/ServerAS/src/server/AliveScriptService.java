package server;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.executeur.Executeur;
import org.json.JSONArray;

import java.util.Hashtable;
import java.util.UUID;

public class AliveScriptService {
    private final static Hashtable<UUID, AliveScriptService> runningServices = new Hashtable<>();
    private final int LIFE_TIME = 60;

    private final UUID idToken;
    private final Executeur executeur;
    private boolean resume = false;
    private boolean compiled = false;

    private AliveScriptService(UUID idToken) {
        this.idToken = idToken;
        this.executeur = new Executeur();
    }

    public static Hashtable<UUID, AliveScriptService> getRunningServices() {
        return runningServices;
    }

    public static AliveScriptService get(UUID idToken) {
        return runningServices.get(idToken);
    }

    public static AliveScriptService create() {
        UUID idToken = UUID.randomUUID();
        System.out.println("New session: " + idToken);
        AliveScriptService aliveScriptService = new AliveScriptService(idToken);
        runningServices.put(idToken, aliveScriptService);
        return aliveScriptService;
    }

    public static AliveScriptService destroy(UUID idToken) {
        return runningServices.remove(idToken);
    }

    public AliveScriptService destroy() {
        System.out.println("End of session: " + idToken);
        return runningServices.remove(this.idToken);
    }

    public UUID getIdToken() {
        return idToken;
    }

    public String compile(String[] lines) {
        resume = false;
        String result = executeur.compiler(lines, true);
        compiled = true;
        return result;
    }

    public void pushDataToExecuteur(JSONArray responseData) {
        for (int i = 0; i < responseData.length(); i++)
            executeur.pushDataResponse(responseData.get(i));
    }

    public String execute() {
        if (!compiled) {
            return "[" +
                    new ASErreur.ErreurAliveScript(
                            "Le code doit \u00EAtre compil\u00E9 avant d'\u00EAtre ex\u00E9cut\u00E9",
                            "ErreurCompilation"
                    ).getAsData(0) +
                    "]";
        }
        String result = executeur.executerMain(resume);

        // if the method was to be called later, resume would be true
        if (!resume) resume = true;

        // if the result starts with '!', it means that the execution just ended
        if (result.startsWith("!")) {
            // we remove the object from memory
            destroy();
            // we remove the '!' from the result
            result = result.substring(1);
        }

        return "{\"idToken\":\"" + getIdToken() + "\", \"result\":" + result + "}";
    }

    @Override
    public String toString() {
        return "server.AliveScriptService{" +
                "idToken=" + idToken +
                ", executeur=" + executeur +
                ", resume=" + resume +
                '}';
    }
}





















