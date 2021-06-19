package interpreteur.as.modules;

import interpreteur.as.ASErreur;
import interpreteur.as.ASObjet;

import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class ModuleNombreUtils extends ASModule {

    public static List<ASObjet.Fonction> fonctions = Arrays.asList(
            new ASObjet.Fonction("entier", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre("texte", "element", null),
                    new ASObjet.Fonction.Parametre("entier", "base", new ASObjet.Entier(10))
            }, "entier") {
                @Override
                public Entier executer() {
                    String valeur = this.getParamsValeursDict().get("element").toString();
                    int base = (Integer) this.getParamsValeursDict().get("base").getValue();
                    try {
                        return new Entier(Integer.parseInt(valeur, base));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + valeur + "' en nombre entier de base '" + base + "'");
                    }
                }
            },


            new ASObjet.Fonction("decimal", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre("texte", "element", null)
            }, "decimal") {
                @Override
                public Decimal executer() {
                    try {
                        return new Decimal(Double.parseDouble(this.getParamsValeursDict().get("element").toString()));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + this.getParamsValeursDict().get("element").toString() + "' en nombre decimal");
                    }
                }
            },


            new ASObjet.Fonction("bin", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre("entier", "i", null)
            }, "texte") {
                @Override
                public Texte executer() {
                    return new Texte(Integer.toBinaryString((Integer) this.getValeurParam("i").getValue()));
                }
            }

    );
    public static List<ASObjet.Constante> constantes = Collections.emptyList();
}

















