package interpreteur.as.modules;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.*;
import interpreteur.as.lang.datatype.ASDecimal;
import interpreteur.as.lang.datatype.ASEntier;
import interpreteur.as.modules.core.ASModule;
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

                new ASFonctionModule("x", ASTypeBuiltin.decimal) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("x")).doubleValue());
                    }
                },

                new ASFonctionModule("y", ASTypeBuiltin.decimal) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("y")).doubleValue());
                    }
                },

                new ASFonctionModule("getDistAvant", ASTypeBuiltin.decimal) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("dA")).doubleValue());
                    }
                },
                new ASFonctionModule("getDistGauche", ASTypeBuiltin.decimal) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("dG")).doubleValue());
                    }
                },
                new ASFonctionModule("getDistDroite", ASTypeBuiltin.decimal) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASDecimal(((Number) getDataVoiture("dD")).doubleValue());
                    }
                },

                new ASFonctionModule("rouler", ASTypeBuiltin.nulType, new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.entier, "vitesseGauche", null),
                        new ASParametre(ASTypeBuiltin.entier, "vitesseDroite", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        throw new ASErreur.StopSetInfo(new Data(Data.Id.ROULER)
                                .addParam(this.getValeurParam("vitesseGauche"))
                                .addParam(this.getValeurParam("vitesseDroite")));
                    }
                }

        }, new ASVariable[]{
                new ASVariable("vitesse", new ASEntier(10), ASTypeBuiltin.tout.asType())
                        .setGetter(() -> new ASDecimal(((Number) getDataVoiture("speed")).doubleValue()))
                        .setSetter((valeur) -> {
                            throw new ASErreur.StopSetInfo(new Data(Data.Id.SET_CAR_SPEED).addParam(valeur));
                        }
                ),
                new ASVariable("distAvant", new ASEntier(10), ASTypeBuiltin.tout.asType())
                        .setGetter(() -> new ASDecimal(((Number) getDataVoiture("dA")).doubleValue()))
                        .setReadOnly()
        });
    }
}
