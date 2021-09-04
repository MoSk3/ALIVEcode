package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.Scope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

import java.util.*;
import java.util.function.Supplier;

public class ModuleBuiltins {


    private static final Supplier<ASObjet<?>> getVarsLocales = () -> {
        List<ASObjet.Variable> variableList = new ArrayList<>(Scope.getCurrentScopeInstance().getVariableStack());
        return new ASObjet.Liste(variableList.stream().map(var -> new ASObjet.Texte(var.obtenirNom())).toArray(ASObjet.Texte[]::new));
    };

    private static final Supplier<ASObjet<?>> getVarsGlobales = () -> {
        List<ASObjet.Variable> variableList = new ArrayList<>(Scope.getScopeInstanceStack().firstElement().getVariableStack());
        return new ASObjet.Liste(variableList.stream().map(var -> new ASObjet.Texte(var.obtenirNom())).toArray(ASObjet.Texte[]::new));
    };

    private static final Supplier<ASObjet<?>> getVarListe = () -> {
        HashSet<ASObjet.Variable> variables = new HashSet<>();
        Scope.getScopeInstanceStack().forEach(scopeInstance -> variables.addAll(scopeInstance.getVariableStack()));
        return new ASObjet.Liste(variables.stream().map(var -> new ASObjet.Texte(var.obtenirNom())).toArray(ASObjet.Texte[]::new));
    };
    /*
     * Module builtins: contient toutes les fonctions utiliser par defaut dans le langage
     */
    //public static List<ASObjet.Fonction> fonctions =
    public static List<ASObjet.Variable> variables = Arrays.asList(
            new ASObjet.Constante("finl", new ASObjet.Texte("\n")),
            new ASObjet.Variable("varLocales", new ASObjet.Liste(), ASObjet.TypeBuiltin.liste.asType()).setGetter(getVarsLocales).setReadOnly(),
            new ASObjet.Variable("varGlobales", new ASObjet.Liste(), ASObjet.TypeBuiltin.liste.asType()).setGetter(getVarsGlobales).setReadOnly(),
            new ASObjet.Variable("varListe", new ASObjet.Liste(), ASObjet.TypeBuiltin.liste.asType()).setGetter(getVarListe).setReadOnly()
    );

    public static List<ASObjet.Fonction> loadFonctions(Executeur executeurInstance) {
        return Arrays.asList(

                new ASObjet.Fonction("afficher", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("tout"), "element", new ASObjet.Texte(""))
                }, new Type("nulType")) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> element = this.getValeurParam("element");
                        executeurInstance.addData(new Data(Data.Id.AFFICHER).addParam(element.toString()));
                        executeurInstance.ecrire(element.toString());
                        return new Nul();
                    }
                },

                new ASObjet.Fonction("attendre", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("nombre"), "duree", new ASObjet.Entier(0))
                }, new Type("nulType")) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> duree = this.getValeurParam("duree");
                        executeurInstance.addData(new Data(Data.Id.ATTENDRE).addParam(((Number) duree.getValue()).doubleValue()));
                        return new Nul();
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
                new ASObjet.Fonction("aleatoire", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("iterable"), "choix", null)
                }, new Type("tout")) {
                    @Override
                    public ASObjet<?> executer() {
                        if (this.getParamsValeursDict().get("choix") instanceof Liste liste) {
                            return liste.get((int) (Math.random() * liste.taille()));
                        } else {
                            Texte liste = (Texte) this.getParamsValeursDict().get("choix");
                            return new Texte(liste.getValue().charAt((int) (Math.random() * liste.getValue().length())));
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
                new ASObjet.Fonction("typeDe", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("tout"), "element", null)
                }, new Type("texte")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Texte(this.getParamsValeursDict().get("element").obtenirNomType());
                    }
                },

                new ASObjet.Fonction("booleen", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(new Type("tout"), "element", null)
                }, ASObjet.TypeBuiltin.booleen.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Booleen(this.getParamsValeursDict().get("element").boolValue());
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
                new ASObjet.Fonction("info", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.tout.asType(), "element", null)
                }, new Type("tout")) {
                    @Override
                    public ASObjet<?> executer() {
                        return this.getParamsValeursDict().get("element");
                    }
                },

                new ASObjet.Fonction("getVar", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "nomVariable", null)
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

        );
    }

}
















