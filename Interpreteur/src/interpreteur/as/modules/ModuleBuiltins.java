package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.Scope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

import java.util.*;

public class ModuleBuiltins {
    /*
     * Module builtins: contient toutes les fonctions utiliser par defaut dans le langage
     */
    public static List<ASObjet.Fonction> fonctions = Arrays.asList(

            new ASObjet.Fonction("afficher", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("tout"), "element", new ASObjet.Texte(""))
            }, new Type("nulType")) {
                @Override
                public ASObjet<?> executer() {
                    ASObjet<?> element = this.getValeurParam("element");
                    Executeur.addData(new Data(Data.Id.AFFICHER).addParam(element.toString()));
                    return new Nul();
                }
            },

            new ASObjet.Fonction("attendre", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("nombre"), "duree", new ASObjet.Entier(0))
            }, new Type("nulType")) {
                @Override
                public ASObjet<?> executer() {
                    ASObjet<?> duree = this.getValeurParam("duree");
                    Executeur.addData(new Data(Data.Id.ATTENDRE).addParam(((Number) duree.getValue()).doubleValue()));
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
                    if (this.getParamsValeursDict().get("choix") instanceof Liste) {
                        Liste liste = (Liste) this.getParamsValeursDict().get("choix");
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
            }, new Type("booleen")) {
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
                    new ASObjet.Fonction.Parametre(new Type("tout"), "element", null)
            }, new Type("tout")) {
                @Override
                public ASObjet<?> executer() {
                    return this.getParamsValeursDict().get("element");
                }
            },

            new ASObjet.Fonction("getVar", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("texte"), "nomVariable", null)
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
    public static List<ASObjet.Variable> variables = Collections.singletonList(
            new ASObjet.Constante("finl", new ASObjet.Texte("\n"))
    );

}
