package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.Nombre;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

public class ModuleIoT {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASObjet.Fonction[] {
                new ASObjet.Fonction("test",
                        new ASObjet.Fonction.Parametre[] {
                            new ASObjet.Fonction.Parametre(
                                    ASObjet.TypeBuiltin.nombre.asType(),
                                    "id",
                                    null
                            ),
                            new ASObjet.Fonction.Parametre(
                                    ASObjet.TypeBuiltin.tout.asType(),
                                    "value",
                                    null
                            )
                        }, ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        Nombre nombre = (Nombre) this.getValeurParam("id");
                        ASObjet<?> value = (ASObjet<?>) this.getValeurParam("value");
                        executeurInstance.addData(new Data(Data.Id.UPDATE_COMPONENT).addParam(nombre) .addParam(value.toString()));
                        return new Nul();
                    }
                }
        });
    }
}
