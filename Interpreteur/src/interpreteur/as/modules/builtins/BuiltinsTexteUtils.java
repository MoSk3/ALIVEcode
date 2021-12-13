package interpreteur.as.modules.builtins;

import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.modules.core.Module;
import interpreteur.as.lang.datatype.Booleen;
import interpreteur.as.lang.datatype.Liste;
import interpreteur.as.lang.datatype.Texte;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;

import java.util.Iterator;

public class BuiltinsTexteUtils {
    public static FonctionModule[] fonctionModules = new FonctionModule[]{

            new FonctionModule("texte", new Parametre[]{
                    new Parametre(TypeBuiltin.tout.asType(), "element", null)
            }, TypeBuiltin.texte.asType()) {
                @Override
                public Texte executer() {
                    return new Texte(this.getValeurParam("element").toString());
                }
            },

            new FonctionModule("maj", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null)
            }, TypeBuiltin.texte.asType()) {
                @Override
                public Texte executer() {
                    return new Texte(this.getParamsValeursDict().get("txt").getValue().toString().toUpperCase());
                }
            },

            new FonctionModule("minus", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null)
            }, new Type("texte")) {
                @Override
                public Texte executer() {
                    return new Texte(this.getParamsValeursDict().get("txt").getValue().toString().toLowerCase());
                }
            },

            new FonctionModule("remplacer", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null),
                    new Parametre(TypeBuiltin.texte.asType(), "sequence", null),
                    new Parametre(TypeBuiltin.texte.asType(), "remplacement", null)
            }, TypeBuiltin.texte.asType()) {
                @Override
                public Texte executer() {
                    String txt = this.getParamsValeursDict().get("txt").getValue().toString();
                    String pattern = this.getParamsValeursDict().get("sequence").getValue().toString();
                    String remplacement = this.getParamsValeursDict().get("remplacement").getValue().toString();
                    return new Texte(txt.replace(pattern, remplacement));
                }
            },

            new FonctionModule("remplacerRe", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null),
                    new Parametre(TypeBuiltin.texte.asType(), "pattern", null),
                    new Parametre(TypeBuiltin.texte.asType(), "remplacement", null)
            }, TypeBuiltin.texte.asType()) {
                @Override
                public Texte executer() {
                    String txt = this.getParamsValeursDict().get("txt").getValue().toString();
                    String pattern = this.getParamsValeursDict().get("pattern").getValue().toString();
                    String remplacement = this.getParamsValeursDict().get("remplacement").getValue().toString();
                    return new Texte(txt.replaceAll(pattern, remplacement));
                }
            },

            new FonctionModule("match", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null),
                    new Parametre(TypeBuiltin.texte.asType(), "pattern", null)
            }, TypeBuiltin.booleen.asType()) {
                @Override
                public Booleen executer() {
                    String txt = this.getParamsValeursDict().get("txt").getValue().toString();
                    String pattern = this.getParamsValeursDict().get("pattern").getValue().toString();
                    return new Booleen(txt.matches(pattern));
                }
            },

            new FonctionModule("estNumerique", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null)
            }, TypeBuiltin.booleen.asType()) {
                @Override
                public Booleen executer() {
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
            new FonctionModule("format", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null),
                    new Parametre(TypeBuiltin.liste.asType(), "valeurs", null)
            }, TypeBuiltin.texte.asType()) {
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
    };

    public static Module charger(Executeur executeurInstance) {
        return new Module(fonctionModules);
    }
}

















