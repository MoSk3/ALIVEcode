package interpreteur.as.modules;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.expressions.Type;

import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class ModuleTexteUtils extends ASModule {

    public static List<ASObjet.Fonction> fonctions = Arrays.asList(

            new ASObjet.Fonction("texte", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(null, "element", null)
            }, new Type("texte")) {
                @Override
                public Texte executer() {
                    return new Texte(this.getValeurParam("element").toString());
                }
            },

            new ASObjet.Fonction("maj", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("texte"), "txt", null)
            }, new Type("texte")) {
                @Override
                public ASObjet.Texte executer() {
                    return new Texte(this.getParamsValeursDict().get("txt").getValue().toString().toUpperCase());
                }
            },

            new ASObjet.Fonction("minus", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("texte"), "txt", null)
            }, new Type("texte")) {
                @Override
                public ASObjet.Texte executer() {
                    return new Texte(this.getParamsValeursDict().get("txt").getValue().toString().toLowerCase());
                }
            },

            new ASObjet.Fonction("estNumerique", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("texte"), "txt", null)
            }, new Type("booleen")) {
                @Override
                public ASObjet.Booleen executer() {
                    try {
                        Integer.parseInt(this.getParamsValeursDict().get("txt").getValue().toString());
                        return new Booleen(true);
                    } catch (NumberFormatException ignored) {
                    }
                    return new Booleen(false);
                }
            },

            /*
             * format:
             * 		@params t:
             * 			-> type: texte
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             *      @params valeurs:
             *          -> type: liste
             *          -> valeur par defaut : null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@type_retour texte
             *
             * 		@return un texte où les {} sont remplacés par les valeurs dans la liste
             */
            new ASObjet.Fonction("format", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("texte"), "txt", null),
                    new ASObjet.Fonction.Parametre(new Type("liste"), "valeurs", null)
            }, new Type("texte")) {
                @Override
                public ASObjet<?> executer() {
                    String texte = ((Texte) this.getValeurParam("txt")).getValue();
                    Iterator<ASObjet<?>> valeurs = ((Liste) this.getValeurParam("valeurs")).getValue().iterator();

                    while (texte.contains("{}")) {
                        if (valeurs.hasNext()) {
                            texte = texte.replaceFirst("[{][}]", valeurs.next().toString());
                        } else {
                            throw new ASErreur.ErreurFormatage("Le nombre de {} doit etre egal au nombre de valeur dans la liste");
                        }
                    }

                    if (texte.contains("{}"))
                        throw new ASErreur.ErreurFormatage("Le nombre de {} doit etre egal au nombre de valeur dans la liste");

                    return new Texte(texte);
                }
            }
    );
    public static List<ASObjet.Constante> constantes = Collections.emptyList();
}

















