package interpreteur.as.modules;

import interpreteur.as.objets.*;
import interpreteur.as.objets.datatype.Decimal;
import interpreteur.as.objets.datatype.Entier;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;


public class ModuleMath {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new FonctionModule[]{
                new FonctionModule("rad", new Parametre[]{
                        new Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.toRadians(angle));
                    }
                },

                new FonctionModule("deg", new Parametre[]{
                        new Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.toDegrees(angle));
                    }
                },

                new FonctionModule("sin", new Parametre[]{
                        new Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.sin(Math.toRadians(angle)));
                    }
                },

                new FonctionModule("cos", new Parametre[]{
                        new Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.cos(Math.toRadians(angle)));
                    }
                },

                new FonctionModule("tan", new Parametre[]{
                        new Parametre(new Type("nombre"), "x", null)
                }, new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.tan(Math.toRadians(angle)));
                    }
                },

                new FonctionModule("arrondir", new Parametre[]{
                        new Parametre(new Type("nombre"), "n", null),
                        new Parametre(new Type("entier"), "nbSignificatifs", new Entier(0)),
                }, new Type("nombre")) {
                    @Override
                    public ASObjet<?> executer() {
                        double n = ((Number) this.getValeurParam("n").getValue()).doubleValue();
                        double shift = Math.pow(10, (Integer) this.getValeurParam("nbSignificatifs").getValue());
                        return new Decimal(Math.round(n * shift) / shift);
                    }
                },
        }, new Variable[]{
                new Constante("PI", new Decimal(Math.PI)),
                new Constante("E", new Decimal(Math.E))
        });
    }
}
