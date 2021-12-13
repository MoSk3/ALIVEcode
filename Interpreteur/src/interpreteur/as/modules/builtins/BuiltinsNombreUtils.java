package interpreteur.as.modules.builtins;

import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.modules.core.Module;
import interpreteur.as.lang.datatype.Decimal;
import interpreteur.as.lang.datatype.Entier;
import interpreteur.as.lang.datatype.Nombre;
import interpreteur.as.lang.datatype.Texte;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;

import java.util.Collections;
import java.util.List;

public class BuiltinsNombreUtils {

    public static FonctionModule[] fonctionModules = new FonctionModule[]{
            new FonctionModule("entier", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null),
                    new Parametre(TypeBuiltin.entier.asType(), "base", new Entier(10))
            }, new Type("entier")) {
                @Override
                public Entier executer() {
                    String valeur = this.getParamsValeursDict().get("txt").toString();
                    int base = (Integer) this.getParamsValeursDict().get("base").getValue();
                    try {
                        return new Entier(Integer.parseInt(valeur, base));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + valeur + "' en nombre entier de base " + base);
                    }
                }
            },

            new FonctionModule("abs", new Parametre[]{
                    new Parametre(new Type("nombre"), "x", null)
            }, new Type("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    return new Decimal(Math.abs(((Number) this.getValeurParam("x").getValue()).doubleValue()));
                }
            },

            new FonctionModule("decimal", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null)
            }, new Type("decimal")) {
                @Override
                public Decimal executer() {
                    try {
                        return new Decimal(Double.parseDouble(this.getParamsValeursDict().get("txt").toString()));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + this.getParamsValeursDict().get("element").toString() + "' en nombre decimal");
                    }
                }
            },


            new FonctionModule("nombre", new Parametre[]{
                    new Parametre(TypeBuiltin.texte.asType(), "txt", null)
            }, new Type("decimal")) {
                @Override
                public Nombre executer() {
                    String nb = this.getParamsValeursDict().get("txt").toString();
                    if (!Nombre.estNumerique(nb))
                        throw new ASErreur.ErreurType("Impossible de convertir " + nb + " en nombre entier ou d\u00E9cimal.");

                    boolean estDecimal = nb.contains(".");
                    if (estDecimal) return new Decimal(Double.parseDouble(nb));
                    else return new Entier(Integer.parseInt(nb));
                }
            },


            new FonctionModule("bin", new Parametre[]{
                    new Parametre(new Type("entier"), "nb", null)
            }, new Type("texte")) {
                @Override
                public Texte executer() {
                    return new Texte(Integer.toBinaryString((Integer) this.getValeurParam("nb").getValue()));
                }
            }
    };
    public static List<Constante> constantes = Collections.emptyList();

    public Module charger(Executeur executeurInstance) {
        return null;
    }
}

















