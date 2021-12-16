package interpreteur.as.modules;

import interpreteur.as.modules.core.ASModule;
import interpreteur.as.lang.*;
import interpreteur.as.lang.datatype.ASDecimal;
import interpreteur.as.lang.datatype.ASEntier;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;


public class ModuleMath {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASFonctionModule[]{
                new ASFonctionModule("rad", new ASParametre[]{
                        new ASParametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.toRadians(angle));
                    }
                },

                new ASFonctionModule("deg", new ASParametre[]{
                        new ASParametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.toDegrees(angle));
                    }
                },

                new ASFonctionModule("sin", new ASParametre[]{
                        new ASParametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.sin(Math.toRadians(angle)));
                    }
                },

                new ASFonctionModule("cos", new ASParametre[]{
                        new ASParametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.cos(Math.toRadians(angle)));
                    }
                },

                new ASFonctionModule("tan", new ASParametre[]{
                        new ASParametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new ASDecimal(Math.tan(Math.toRadians(angle)));
                    }
                },

                new ASFonctionModule("arrondir", new ASParametre[]{
                        new ASParametre(new Type("nombre"), "n", null),
                        new ASParametre(new Type("entier"), "nbSignificatifs", new ASEntier(0)),
                }, new Type("nombre")) {
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
