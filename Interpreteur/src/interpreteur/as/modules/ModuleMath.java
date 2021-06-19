package interpreteur.as.modules;

import interpreteur.as.ASObjet;



public class ModuleMath extends ASModule {

    public static void charger() {
        ajouterModule("Math", new ASObjet.Fonction[]{
                new ASObjet.Fonction("sin", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre("decimal|entier", "x", null)
                }, "decimal") {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.sin(Math.toRadians(angle)));
                    }
                },

                new ASObjet.Fonction("cos", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre("decimal|entier", "x", null)
                }, "decimal") {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.cos(Math.toRadians(angle)));
                    }
                },

                new ASObjet.Fonction("tan", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre("decimal|entier", "x", null)
                }, "decimal") {
                    @Override
                    public ASObjet<?> executer() {
                        double angle = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return new Decimal(Math.tan(Math.toRadians(angle)));
                    }
                },

                new ASObjet.Fonction("abs", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre("decimal|entier", "x", null)
                }, "decimal") {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(Math.abs(((Number) this.getValeurParam("x").getValue()).doubleValue()));
                    }
                },

                new ASObjet.Fonction("arrondir", new ASObjet.Fonction.Parametre[]{
                        new ASObjet.Fonction.Parametre("decimal|entier", "n", null),
                        new ASObjet.Fonction.Parametre("entier", "nbSignificatifs", new ASObjet.Entier(0)),
                }, "decimal") {
                    @Override
                    public ASObjet<?> executer() {
                        double n = ((Number) this.getValeurParam("n").getValue()).doubleValue();
                        double shift = Math.pow(10, (Integer) this.getValeurParam("nbSignificatifs").getValue());
                        return new Decimal(Math.round(n * shift) / shift);
                    }
                },
        }, new ASObjet.Constante[]{
                new ASObjet.Constante("PI", new ASObjet.Decimal(Math.PI)),
                new ASObjet.Constante("E", new ASObjet.Decimal(Math.E))
        });
    }

}
