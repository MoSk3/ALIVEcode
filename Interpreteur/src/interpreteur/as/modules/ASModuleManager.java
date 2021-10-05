package interpreteur.as.modules;


import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.Scope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.executeur.Executeur;

import java.util.*;

/**
 * Interface responsable de tous les modules builtins
 *
 * @author Mathis Laroche
 */
public record ASModuleManager(Executeur executeurInstance) {
    private final static Hashtable<EnumModule, ModuleFactory> MODULE_FACTORY = new Hashtable<>();
    /*
    TABLE DES MATIERES:
    Module:
    -builtins

    -Voiture
    -Math
     */

    public static void enregistrerModule(EnumModule nomModule, ModuleFactory moduleFactory) {
        MODULE_FACTORY.put(nomModule, moduleFactory);
    }


<<<<<<< HEAD
    public ASModule getModuleBuiltins() {
        return MODULE_FACTORY.get(EnumModule.builtins).charger(executeurInstance);
    }

    public void utiliserModuleBuitlins() {
        var moduleBuiltins = getModuleBuiltins();
        moduleBuiltins.utiliser((String) null);
        Scope.getCurrentScope().declarerVariable(new ASObjet.Constante("builtins", new ASObjet.Liste(moduleBuiltins
                .getNomsConstantesEtFonctions()
                .stream()
                .map(ASObjet.Texte::new)
                .toArray(ASObjet.Texte[]::new))));
=======
    private void ajouterModule(String nomModule, Variable[] variables) {
        moduleDict.put(nomModule, new Module(nomModule, new Fonction[]{}, variables));
    }

    // initialise les modules
    public void init() {
        if (!dejaCharger) {
            chargerModules();
            dejaCharger = true;
        }
    }

    /**
     * methode où sont definies tous les modules de base du langage
     */
    private void chargerModules() {

        List<Fonction> fonctionBuiltins = new ArrayList<>(ModuleBuiltins.loadFonctions(executeurInstance));
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

        new ModuleMath(this).charger();

        new ModuleAst(this).charger();

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
                        return null;
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
                        .setGetter(() -> new Decimal(((Number) getDataVoiture.apply("speed")).doubleValue()))
                        .setSetter((valeur) -> {
                            throw new ASErreur.StopSetInfo(new Data(Data.Id.SET_CAR_SPEED).addParam(valeur));
                        }
                ),
                new Variable("distAvant", new Entier(10), new Type("tout"))
                        .setGetter(() -> new Decimal(((Number) getDataVoiture.apply("dA")).doubleValue()))
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
>>>>>>> dev
    }

    public void utiliserModule(String nomModule) {
        if (nomModule.equals("builtins")) {
            new ASErreur.AlerteUtiliserBuiltins("Il est inutile d'utiliser builtins, puisqu'il est utilise par defaut");
            return;
        }

        // module vide servant à charger les fonctionnalitées expérimentales
        if (nomModule.equals("experimental")) {
            return;
        }
        ASModule module = getModule(nomModule);

        module.utiliser(nomModule);
        Scope.getCurrentScope().declarerVariable(new ASObjet.Constante(nomModule, new ASObjet.Liste(module
                .getNomsConstantesEtFonctions()
                .stream()
                .map(e -> nomModule + "." + e)
                .map(ASObjet.Texte::new)
                .toArray(ASObjet.Texte[]::new))));
    }

    /**
     * @param nomModule <li>nom du module a utiliser</li>
     * @param methodes  <li></li>
     */
    public void utiliserModule(String nomModule, String[] methodes) {
        if (nomModule.equals("builtins")) {
            new ASErreur.AlerteUtiliserBuiltins("Il est inutile d'utiliser builtins, puisque le module builtins est utilise par defaut");
            return;
        }

        ASModule module = getModule(nomModule);

        List<String> nomsFctEtConstDemandees = Arrays.asList(methodes);

        List<String> fctEtConstPasDansModule = new ArrayList<>(nomsFctEtConstDemandees);
        fctEtConstPasDansModule.removeAll(module.getNomsConstantesEtFonctions());

        if (fctEtConstPasDansModule.size() > 0)
            throw new ASErreur.ErreurModule("Le module '" + nomModule + "' ne contient pas les fonctions ou les constantes: "
                    + fctEtConstPasDansModule.toString()
                    .replaceAll("\\[|]", ""));

        module.utiliser(nomsFctEtConstDemandees);
        Scope.getCurrentScope().declarerVariable(new ASObjet.Constante(nomModule, new ASObjet.Liste(nomsFctEtConstDemandees
                .stream()
                .map(ASObjet.Texte::new)
                .toArray(ASObjet.Texte[]::new))));
    }


    public ASModule getModule(String nomModule) {
        ModuleFactory module;
        try {
            module = MODULE_FACTORY.get(EnumModule.valueOf(nomModule));
        } catch (IllegalArgumentException err) {
            throw new ASErreur.ErreurModule("Le module '" + nomModule + "' n'existe pas");
        }
        return module.charger(executeurInstance);
    }
}



























