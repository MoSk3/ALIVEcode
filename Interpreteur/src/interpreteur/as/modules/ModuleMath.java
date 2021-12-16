package interpreteur.as.modules;

import interpreteur.as.lang.*;
import interpreteur.as.lang.datatype.ASDecimal;
import interpreteur.as.lang.datatype.ASEntier;
import interpreteur.as.modules.core.ASModule;
import interpreteur.executeur.Executeur;


public class ModuleMath {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASFonctionModule[]{
                new ASFonctionModule("rad", ASTypeBuiltin.decimal, new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.nombre, "x", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.toRadians(angle));
                    }
                },

                new ASFonctionModule("deg", ASTypeBuiltin.decimal, new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.nombre, "x", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.toDegrees(angle));
                    }
                },

                new ASFonctionModule("sin", ASTypeBuiltin.decimal, new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.nombre, "x", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.sin(Math.toRadians(angle)));
                    }
                },

                new ASFonctionModule("cos", ASTypeBuiltin.decimal, new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.nombre, "x", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.cos(Math.toRadians(angle)));
                    }
                },

                new ASFonctionModule("tan", ASTypeBuiltin.decimal, new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.nombre, "x", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.tan(Math.toRadians(angle)));
                    }
                },

                new ASFonctionModule("arrondir", ASTypeBuiltin.nombre, new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.nombre, "n", null),
                        new ASParametre(ASTypeBuiltin.entier, "nbSignificatifs", new ASEntier(0)),
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        double n = ((Number) this.getValeurParam("n").getValue()).doubleValue();
                        double shift = Math.pow(10, (Integer) this.getValeurParam("nbSignificatifs").getValue());
                        return new ASDecimal(Math.round(n * shift) / shift);
                    }
                },
        }, new ASVariable[]{
                new ASConstante("PI", new ASDecimal(Math.PI)),
                new ASConstante("E", new ASDecimal(Math.E))
        });
    }
}
