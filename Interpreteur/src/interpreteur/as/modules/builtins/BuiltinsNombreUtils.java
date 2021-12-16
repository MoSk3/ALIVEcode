package interpreteur.as.modules.builtins;

import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.modules.core.ASModule;
import interpreteur.as.lang.datatype.ASDecimal;
import interpreteur.as.lang.datatype.ASEntier;
import interpreteur.as.lang.datatype.ASNombre;
import interpreteur.as.lang.datatype.ASTexte;
import interpreteur.as.lang.ASType;
import interpreteur.executeur.Executeur;

import java.util.Collections;
import java.util.List;

public class BuiltinsNombreUtils {

    public static ASFonctionModule[] fonctionModules = new ASFonctionModule[]{
            new ASFonctionModule("entier", new ASType("entier"), new ASParametre[]{
                    new ASParametre(ASTypeBuiltin.texte.asType(), "txt", null),
                    new ASParametre(ASTypeBuiltin.entier.asType(), "base", new ASEntier(10))
            }) {
                @Override
                public ASEntier executer() {
                    String valeur = this.getParamsValeursDict().get("txt").toString();
                    int base = (Integer) this.getParamsValeursDict().get("base").getValue();
                    try {
                        return new ASEntier(Integer.parseInt(valeur, base));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + valeur + "' en nombre entier de base " + base);
                    }
                }
            },

            new ASFonctionModule("abs", new ASType("nombre"), new ASParametre[]{
                    new ASParametre(new ASType("nombre"), "x", null)
            }) {
                @Override
                public ASObjet<?> executer() {
                    return new ASDecimal(Math.abs(((Number) this.getValeurParam("x").getValue()).doubleValue()));
                }
            },

            new ASFonctionModule("decimal", new ASType("decimal"), new ASParametre[]{
                    new ASParametre(ASTypeBuiltin.texte.asType(), "txt", null)
            }) {
                @Override
                public ASDecimal executer() {
                    try {
                        return new ASDecimal(Double.parseDouble(this.getParamsValeursDict().get("txt").toString()));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + this.getParamsValeursDict().get("element").toString() + "' en nombre decimal");
                    }
                }
            },


            new ASFonctionModule("nombre", new ASType("decimal"), new ASParametre[]{
                    new ASParametre(ASTypeBuiltin.texte.asType(), "txt", null)
            }) {
                @Override
                public ASNombre executer() {
                    String nb = this.getParamsValeursDict().get("txt").toString();
                    if (!ASNombre.estNumerique(nb))
                        throw new ASErreur.ErreurType("Impossible de convertir " + nb + " en nombre entier ou d\u00E9cimal.");

                    boolean estDecimal = nb.contains(".");
                    if (estDecimal) return new ASDecimal(Double.parseDouble(nb));
                    else return new ASEntier(Integer.parseInt(nb));
                }
            },


            new ASFonctionModule("bin", new ASType("texte"), new ASParametre[]{
                    new ASParametre(new ASType("entier"), "nb", null)
            }) {
                @Override
                public ASTexte executer() {
                    return new ASTexte(Integer.toBinaryString((Integer) this.getValeurParam("nb").getValue()));
                }
            }
    };
    public static List<ASConstante> constantes = Collections.emptyList();

    public ASModule charger(Executeur executeurInstance) {
        return null;
    }
}

















