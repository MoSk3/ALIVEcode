package interpreteur.as.modules;


import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.ASObjet.*;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.data_manager.Data;
import interpreteur.data_manager.DataVoiture;
import org.json.JSONObject;

import java.util.*;
import java.util.function.Function;

/**
 * Interface responsable de tous les modules builtins
 *
 * @author Mathis Laroche
 */
public class ASModule {
    private static final Hashtable<String, Module> moduleDict = new Hashtable<>();
    private static boolean dejaCharger = false;

    /*
    TABLE DES MATIERES:
    Module:
    -builtins

    -Voiture
    -Math
     */


    /**
     * ATTENTION: CETTE METHODE NE DEVRAIT PAS ETRE APPELE AILLEURS QUE DANS ASObjet.FonctionManger.reset()
     *
     * @return le module builtins
     */
    public static Module getModuleBuiltins() {
        return moduleDict.get("builtins");
    }

    // methode permettant d'ajouter un module au dictionnaire de modules
    protected static void ajouterModule(String nomModule, Fonction[] fonctions, Variable[] variables) {
        moduleDict.put(nomModule, new Module(nomModule, fonctions, variables));
    }

    protected static void ajouterModule(String nomModule, Fonction[] fonctions) {
        moduleDict.put(nomModule, new Module(nomModule, fonctions, new Variable[]{}));
    }

    protected static void ajouterModule(String nomModule, Variable[] variables) {
        moduleDict.put(nomModule, new Module(nomModule, new Fonction[]{}, variables));
    }

    // initialise les modules
    public static void init() {
        if (!dejaCharger) {
            chargerModules();
            System.out.println("init");
            dejaCharger = true;
        }
    }

    /**
     * methode où sont definies tous les modules de base du langage
     */
    protected static void chargerModules() {

        List<Fonction> fonctionBuiltins = new ArrayList<>(ModuleBuiltins.fonctions);
        fonctionBuiltins.addAll(ModuleTexteUtils.fonctions);
        fonctionBuiltins.addAll(ModuleListeUtils.fonctions);
        fonctionBuiltins.addAll(ModuleNombreUtils.fonctions);

        List<Variable> variablesBuiltins = new ArrayList<>(ModuleBuiltins.variables);
        variablesBuiltins.addAll(ModuleTexteUtils.constantes);
        variablesBuiltins.addAll(ModuleListeUtils.constantes);
        variablesBuiltins.addAll(ModuleNombreUtils.constantes);

        ajouterModule("builtins",
                fonctionBuiltins.toArray(Fonction[]::new),
                variablesBuiltins.toArray(Variable[]::new)
        );

        ModuleMath.charger();

        ModuleAst.charger();

        ajouterModule("Iot", new Fonction[]{
                new Fonction(
                        "envoyer",
                        new Fonction.Parametre[]{
                                new Fonction.Parametre(new Type("entier"), "id", null),
                                new Fonction.Parametre(new Type("liste"), "params", new Liste()),
                        },
                        new Type("nulType")
                ) {
                    @Override
                    public ASObjet<?> executer() {
                        return super.executer();
                    }
                },
        }, new Constante[]{

        });


        /*
         * Module Voiture
         */
        Function<String, Object> getDataVoiture = (parametre) -> {
            JSONObject dataVoiture = DataVoiture.getDataVoiture();
            if (dataVoiture == null) {
                DataVoiture.requestDataVoiture();
                throw new ASErreur.StopGetInfo(new Data(Data.Id.GET).addParam("car"));
            } else {
                return dataVoiture.get(parametre);
            }
        };

		/*
		Data accessibles de la voiture:
			-> acceleration en x
			-> acceleration en y
			->
		 */
        ajouterModule("Voiture", new Fonction[]{

                new Fonction("x", new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture.apply("x")).doubleValue());
                    }
                },

                new Fonction("y",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture.apply("y")).doubleValue());
                    }
                },

                new Fonction("getDistAvant",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture.apply("dA")).doubleValue());
                    }
                },
                new Fonction("getDistGauche",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture.apply("dG")).doubleValue());
                    }
                },
                new Fonction("getDistDroite",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture.apply("dD")).doubleValue());
                    }
                },

                new Fonction("rouler", new Fonction.Parametre[]{
                        new Fonction.Parametre(new Type("entier"), "vitesseGauche", null),
                        new Fonction.Parametre(new Type("entier"), "vitesseDroite", null)
                },  new Type("nulType")) {
                    @Override
                    public ASObjet<?> executer() {
                        throw new ASErreur.StopSetInfo(new Data(Data.Id.ROULER)
                                .addParam(this.getValeurParam("vitesseGauche"))
                                .addParam(this.getValeurParam("vitesseDroite")));
                    }
                }

        }, new Variable[]{
                new Variable("vitesse", new Entier(10), new Type("tout"))
                        .setGetter((var) -> new Decimal(((Number) getDataVoiture.apply("speed")).doubleValue()))
                        .setSetter((valeur) -> {
                            throw new ASErreur.StopSetInfo(new Data(Data.Id.SET_CAR_SPEED).addParam(valeur));
                        }
                ),
                new Variable("distAvant", new Entier(10), new Type("tout"))
                        .setGetter((var) -> new Decimal(((Number) getDataVoiture.apply("dA")).doubleValue()))
                        .setReadOnly()
        });

        /*
         * Module IA
         */
        ajouterModule("IA", new Fonction[]{
                new Fonction("moyenne", new Fonction.Parametre[]{
                        new Fonction.Parametre(new Type("liste"), "valeurs", null)
                },  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        Liste liste = (Liste) this.getValeurParam("valeurs");

                        double sum = 0;
                        for (ASObjet<?> element : liste.getValue()) {
                            sum += ((Number) element.getValue()).doubleValue();
                        }

                        return new Decimal(sum / liste.taille());
                    }
                }
        });
    }

    public static void utiliserModule(String nomModule) {
        if (nomModule.equals("builtins")) {
            new ASErreur.AlerteUtiliserBuiltins("Il est inutile d'utiliser builtins, puisqu'il est utilise par defaut");
            return;
        }

        // module vide servant à charger les fonctionnalitées expérimentales
        if (nomModule.equals("experimental")) {
            return;
        }
        Module module = getModule(nomModule);

        module.utiliser();
    }

    /**
     * @param nomModule <li>nom du module a utiliser</li>
     * @param methodes  <li></li>
     */
    public static void utiliserModule(String nomModule, String[] methodes) {
        if (nomModule.equals("builtins")) {
            new ASErreur.AlerteUtiliserBuiltins("Il est inutile d'utiliser builtins, puisque le module builtins est utilise par defaut");
            return;
        }

        Module module = getModule(nomModule);

        List<String> nomsFctEtConstDemandees = Arrays.asList(methodes);

        List<String> fctEtConstPasDansModule = new ArrayList<>(nomsFctEtConstDemandees);
        fctEtConstPasDansModule.removeAll(module.getNomsConstantesEtFonctions());

        if (fctEtConstPasDansModule.size() > 0)
            throw new ASErreur.ErreurModule("Le module '" + nomModule + "' ne contient pas les fonctions ou les constantes: "
                    + fctEtConstPasDansModule.toString()
                    .replaceAll("\\[|]", ""));

        module.utiliser(nomsFctEtConstDemandees);
    }


    public static Module getModule(String nomModule) {
        Module module = moduleDict.get(nomModule);
        if (module == null) throw new ASErreur.ErreurModule("Le module '" + nomModule + "' n'existe pas");

        return module;
    }
}



























