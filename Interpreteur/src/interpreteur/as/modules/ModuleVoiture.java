package interpreteur.as.modules;

import interpreteur.as.modules.core.ASModule;
import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.ASDecimal;
import interpreteur.as.lang.datatype.ASEntier;
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
        return new ASModule(new ASFonctionModule[]{

                new ASFonctionModule("x", new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("x")).doubleValue());
                    }
                },

                new ASFonctionModule("y",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("y")).doubleValue());
                    }
                },

                new ASFonctionModule("getDistAvant",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("dA")).doubleValue());
                    }
                },
                new ASFonctionModule("getDistGauche",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("dG")).doubleValue());
                    }
                },
                new ASFonctionModule("getDistDroite",  new Type("decimal")) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("dD")).doubleValue());
                    }
                },

                new ASFonctionModule("rouler", new ASParametre[]{
                        new ASParametre(new Type("entier"), "vitesseGauche", null),
                        new ASParametre(new Type("entier"), "vitesseDroite", null)
                },  new Type("nulType")) {
                    @Override
                    public ASObjet<?> executer() {
                        throw new ASErreur.StopSetInfo(new Data(Data.Id.ROULER)
                                .addParam(this.getValeurParam("vitesseGauche"))
                                .addParam(this.getValeurParam("vitesseDroite")));
                    }
                }

        }, new ASVariable[]{
                new ASVariable("vitesse", new ASEntier(10), new Type("tout"))
                        .setGetter(() -> new ASDecimal(((Number) getDataVoiture("speed")).doubleValue()))
                        .setSetter((valeur) -> {
                            throw new ASErreur.StopSetInfo(new Data(Data.Id.SET_CAR_SPEED).addParam(valeur));
                        }
                ),
                new ASVariable("distAvant", new ASEntier(10), new Type("tout"))
                        .setGetter(() -> new ASDecimal(((Number) getDataVoiture("dA")).doubleValue()))
                        .setReadOnly()
        });
    }
}
