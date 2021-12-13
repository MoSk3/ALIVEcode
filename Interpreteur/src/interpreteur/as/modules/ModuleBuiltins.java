package interpreteur.as.modules;

import interpreteur.as.modules.core.Module;
import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.modules.builtins.BuiltinsListeUtils;
import interpreteur.as.modules.builtins.BuiltinsNombreUtils;
import interpreteur.as.modules.builtins.BuiltinsTexteUtils;
import interpreteur.as.lang.datatype.*;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

import java.util.*;
import java.util.function.Supplier;

public class ModuleBuiltins {
    private static final Supplier<ASObjet<?>> getVarsLocales = () -> {
        List<Variable> variableList = new ArrayList<>(Scope.getCurrentScopeInstance().getVariableStack());
        return new Liste(variableList.stream().map(var -> new Texte(var.obtenirNom())).toArray(Texte[]::new));
    };
    private static final Supplier<ASObjet<?>> getVarsGlobales = () -> {
        List<Variable> variableList = new ArrayList<>(Scope.getScopeInstanceStack().firstElement().getVariableStack());
        return new Liste(variableList.stream().map(var -> new Texte(var.obtenirNom())).toArray(Texte[]::new));
    };
    private static final Supplier<ASObjet<?>> getVarListe = () -> {
        HashSet<Variable> variables = new HashSet<>();
        Scope.getScopeInstanceStack().forEach(scopeInstance -> variables.addAll(scopeInstance.getVariableStack()));
        return new Liste(variables.stream().map(var -> new Texte(var.obtenirNom())).toArray(Texte[]::new));
    };

    /*
     * Module builtins: contient toutes les fonctions utiliser par defaut dans le langage
     */
    //public static List<ASObjet.Fonction> fonctions =
    public static Variable[] variables = new Variable[]{
            new Constante("bob", new Texte("(~°3°)~")),
            new Constante("finl", new Texte("\n")),
            new Variable("varLocales", new Liste(), TypeBuiltin.liste.asType()).setGetter(getVarsLocales).setReadOnly(),
            new Variable("varGlobales", new Liste(), TypeBuiltin.liste.asType()).setGetter(getVarsGlobales).setReadOnly(),
            new Variable("varListe", new Liste(), TypeBuiltin.liste.asType()).setGetter(getVarListe).setReadOnly(),
    };

    public static Module charger(Executeur executeurInstance) {
        FonctionModule[] fonctionModules = new FonctionModule[]{

                new FonctionModule("afficher", new Parametre[]{
                        new Parametre(new Type("tout"), "element", new Texte(""))
                }, TypeBuiltin.rien.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> element = this.getValeurParam("element");
                        executeurInstance.addData(new Data(Data.Id.AFFICHER).addParam(element.toString()));
                        executeurInstance.ecrire(element.toString());
                        return new ValeurNul();
                    }
                },

                new FonctionModule("attendre", new Parametre[]{
                        new Parametre(new Type("nombre"), "duree", new Entier(0))
                }, TypeBuiltin.rien.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> duree = this.getValeurParam("duree");
                        executeurInstance.addData(new Data(Data.Id.ATTENDRE).addParam(((Number) duree.getValue()).doubleValue()));
                        return new ValeurNul();
                    }
                },

                /*
                 * aleatoire:
                 * 		@param choix:
                 * 			-> type: liste ou texte
                 * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
                 *
                 * 		@type_retour null (aucune contrainte sur le type retourne)
                 *
                 * 		@return -> si "choix" est de type liste: un element aleatoirement choisi dans la liste
                 * 				-> si "choix" est de type texte: une lettre aleatoirement choisi dans le texte
                 */
                new FonctionModule("aleatoire", new Parametre[]{
                        new Parametre(new Type("iterable"), "choix", null)
                }, new Type("tout")) {
                    @Override
                    public ASObjet<?> executer() {
                        if (this.getParamsValeursDict().get("choix") instanceof Liste liste) {
                            return liste.get((int) (Math.random() * liste.taille()));
                        } else {
                            Texte texte = (Texte) this.getParamsValeursDict().get("choix");
                            return new Texte(texte.getValue().charAt((int) (Math.random() * texte.taille())));
                        }
                    }
                },

                /*
                 * typeDe:
                 * 		@param objet:
                 * 			-> type: null (aucune contrainte sur le type)
                 * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
                 *
                 * 		@type_retour texte
                 *
                 * 		@return le nom du type de l'objet passe en parametre dans un "texte"
                 */
                new FonctionModule("typeDe", new Parametre[]{
                        new Parametre(new Type("tout"), "element", null)
                }, new Type("texte")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Texte(this.getParamsValeursDict().get("element").obtenirNomType());
                    }
                },

                new FonctionModule("booleen", new Parametre[]{
                        new Parametre(TypeBuiltin.tout.asType(), "element", null)
                }, TypeBuiltin.booleen.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Booleen(this.getParamsValeursDict().get("element").boolValue());
                    }
                },

                new FonctionModule("auto", new Parametre[]{
                        new Parametre(TypeBuiltin.texte.asType(), "txt", null)
                }, TypeBuiltin.tout.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        var txt = ((Texte) this.getValeurParam("txt")).getValue().trim();
                        if (Nombre.estNumerique(txt)) {
                            Nombre.parse(this.getValeurParam("txt"));
                        } else if (Booleen.estBooleen(txt)) {
                            return new Booleen(txt);
                        }
                        return new Texte(txt);
                    }
                },

                new FonctionModule("clef", new Parametre[]{
                        new Parametre(TypeBuiltin.paire.asType(), "_paire", null)
                }, TypeBuiltin.texte.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return ((ASPaire) getValeurParam("_paire")).clef();
                    }
                },

                new FonctionModule("val", new Parametre[]{
                        new Parametre(TypeBuiltin.paire.asType(), "_paire", null)
                }, TypeBuiltin.texte.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return ((ASPaire) getValeurParam("_paire")).valeur();
                    }
                },



                /*
                 * affiche le commentaire entre les symboles
                 * (-:
                 *  -
                 * :-)
                 * dans la fonction passée en paramètre
                 *
                 */
                new FonctionModule("info", new Parametre[]{
                        new Parametre(TypeBuiltin.tout.asType(), "element", null)
                }, new Type("tout")) {
                    @Override
                    public ASObjet<?> executer() {
                        return this.getParamsValeursDict().get("element");
                    }
                },

                new FonctionModule("getVar", new Parametre[]{
                        new Parametre(TypeBuiltin.texte.asType(), "nomVariable", null)
                }, new Type("tout")) {
                    @Override
                    public ASObjet<?> executer() {
                        String nomVar = (String) this.getValeurParam("nomVariable").getValue();
                        Variable var = Scope.getCurrentScopeInstance().getVariable(nomVar);
                        if (var == null) {
                            throw new ASErreur.ErreurVariableInconnue("La variable '" + nomVar + "' n'est pas d\u00E9clar\u00E9e dans ce scope.");
                        }
                        return var.getValeurApresGetter();
                    }
                }
        };

        var fonctionsBuiltins = new ArrayList<>(List.of(fonctionModules));
        fonctionsBuiltins.addAll(List.of(BuiltinsListeUtils.fonctionModules));
        fonctionsBuiltins.addAll(List.of(BuiltinsTexteUtils.fonctionModules));
        fonctionsBuiltins.addAll(List.of(BuiltinsNombreUtils.fonctionModules));

        return new Module(fonctionsBuiltins.toArray(FonctionModule[]::new), variables);
    }
}
















