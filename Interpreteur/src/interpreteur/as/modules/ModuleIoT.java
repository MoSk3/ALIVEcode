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
                                    ASObjet.TypeBuiltin.texte.asType(),
                                    "projectId",
                                    null
                            ),
                            new ASObjet.Fonction.Parametre(
                                    ASObjet.TypeBuiltin.texte.asType(),
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
                        Texte projectId = (Texte) this.getValeurParam("projectId");
                        Texte id = (Texte) this.getValeurParam("id");
                        ASObjet<?> value = (ASObjet<?>) this.getValeurParam("value");
                        executeurInstance.addData(new Data(Data.Id.UPDATE_COMPONENT).addParam(projectId).addParam(id).addParam(value.toString()));
                        return new Nul();
                    }
                }
        });
    }
}
