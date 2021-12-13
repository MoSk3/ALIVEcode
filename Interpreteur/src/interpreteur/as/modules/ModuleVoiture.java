package interpreteur.as.modules;

import interpreteur.as.objets.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.objets.datatype.Decimal;
import interpreteur.as.objets.datatype.Entier;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.data_manager.Data;
import interpreteur.data_manager.DataVoiture;
import interpreteur.executeur.Executeur;
import org.json.JSONObject;

public class ModuleVoiture {

    private static Object getDataVoiture(String parametre) {
        JSONObject dataVoiture = DataVoiture.getDataVoiture();
        if (dataVoiture == null) {
            DataVoiture.requestDataVoiture();
            throw new ASErreur.StopGetInfo(new Data(Data.Id.GET).addParam("car"));
        } else {
            return dataVoiture.get(parametre);
        }
    }

    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new FonctionModule[]{

                new FonctionModule("x", new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("x")).doubleValue());
                    }
                },

                new FonctionModule("y",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("y")).doubleValue());
                    }
                },

                new FonctionModule("getDistAvant",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("dA")).doubleValue());
                    }
                },
                new FonctionModule("getDistGauche",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("dG")).doubleValue());
                    }
                },
                new FonctionModule("getDistDroite",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Decimal(((Number) getDataVoiture("dD")).doubleValue());
                    }
                },

                new FonctionModule("rouler", new Parametre[]{
                        new Parametre(new Type("entier"), "vitesseGauche", null),
                        new Parametre(new Type("entier"), "vitesseDroite", null)
                },  new Type("nulType")) {
                    @Override
                    public ASObjet<?> executer() {
                        throw new ASErreur.StopSetInfo(new Data(Data.Id.ROULER)
                                .addParam(this.getValeurParam("vitesseGauche"))
                                .addParam(this.getValeurParam("vitesseDroite")));
                    }
                }

        }, new Variable[]{
                new Variable("vitesse", new Entier(10), new Type("tout"))
                        .setGetter(() -> new Decimal(((Number) getDataVoiture("speed")).doubleValue()))
                        .setSetter((valeur) -> {
                            throw new ASErreur.StopSetInfo(new Data(Data.Id.SET_CAR_SPEED).addParam(valeur));
                        }
                ),
                new Variable("distAvant", new Entier(10), new Type("tout"))
                        .setGetter(() -> new Decimal(((Number) getDataVoiture("dA")).doubleValue()))
                        .setReadOnly()
        });
    }
}
