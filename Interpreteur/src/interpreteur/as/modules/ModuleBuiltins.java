package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.expressions.Type;

import java.util.*;

public class ModuleBuiltins {
    /*
     * Module builtins: contient toutes les fonctions utiliser par defaut dans le langage
     */
    public static List<ASObjet.Fonction> fonctions = Arrays.asList(
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
            new ASObjet.Fonction("typeDe", new ASObjet.Fonction.Parametre[]{new ASObjet.Fonction.Parametre(null, "element", null)}, new Type("texte")) {
                @Override
                public ASObjet<?> executer() {
                    return new Texte(this.getParamsValeursDict().get("element").obtenirNomType());
                }
            },

            new ASObjet.Fonction("booleen", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(null, "element", null)
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
            new ASObjet.Fonction("info", new ASObjet.Fonction.Parametre[]{new ASObjet.Fonction.Parametre(null, "element", null)}, new Type("tout")) {
                @Override
                public ASObjet<?> executer() {
                    return this.getParamsValeursDict().get("element");
                }
            }
    );
    public static List<ASObjet.Variable> variables = Collections.singletonList(
            new ASObjet.Constante("finl", new ASObjet.Texte("\n"))
    );

}
