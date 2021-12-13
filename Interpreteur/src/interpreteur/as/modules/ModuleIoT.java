package interpreteur.as.modules;

import interpreteur.as.modules.core.Module;
import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.Booleen;
import interpreteur.as.lang.datatype.Nombre;
import interpreteur.as.lang.datatype.Texte;
import interpreteur.as.lang.datatype.ValeurNul;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

public class ModuleIoT {
    static Module charger(Executeur executeurInstance) {
        return new Module(new FonctionModule[] {
                new FonctionModule("update",
                        new Parametre[] {
                            new Parametre(
                                    TypeBuiltin.texte.asType(),
                                    "projectId",
                                    null
                            ),
                            new Parametre(
                                    TypeBuiltin.texte.asType(),
                                    "id",
                                    null
                            ),
                            new Parametre(
                                    TypeBuiltin.tout.asType(),
                                    "value",
                                    null
                            )
                        }, TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        Texte projectId = (Texte) this.getValeurParam("projectId");
                        Texte id = (Texte) this.getValeurParam("id");
                        ASObjet<?> valueAs = (ASObjet<?>) this.getValeurParam("value");

                        executeurInstance.addData(new Data(Data.Id.UPDATE_COMPONENT).addParam(projectId).addParam(id).addParam(valueAs.getValue()));
                        return new ValeurNul();
                    }
                },
                new FonctionModule("get",
                        new Parametre[] {
                                new Parametre(
                                        TypeBuiltin.texte.asType(),
                                        "key",
                                        new ValeurNul()
                                )
                        }, TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> uncastedKey = (ASObjet<?>) this.getValeurParam("key");
                        if(uncastedKey instanceof ValeurNul) {
                            return new Texte(executeurInstance.getContext().toString());
                        }

                        Texte key = (Texte) uncastedKey;

                        Object obj = executeurInstance.getContext().get(key.toString());
                        if(obj == null) {
                            throw new ModuleIoT.KeyNotPresent("Erreur, la clé " + key + " n'est pas présente dans l'objet de réponse.");
                        }
                        if(obj instanceof String) {
                            return new Texte(obj);
                        }
                        if(obj instanceof Number) {
                            return Nombre.cast((Number) obj);
                        }
                        if(obj instanceof Boolean) {
                            return new Booleen((Boolean) obj);
                        }
                        return new ValeurNul();
                    }
                },
                new FonctionModule("getComponentValue",
                        new Parametre[] {
                                new Parametre(
                                        TypeBuiltin.texte.asType(),
                                        "projectId",
                                        null
                                ),
                                new Parametre(
                                        TypeBuiltin.texte.asType(),
                                        "id",
                                        null
                                )
                        }, TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ValeurNul();
                    }
                }
        });
    }

    private static class KeyNotPresent extends ASErreur.ErreurAliveScript {
        public KeyNotPresent(String message) {
            super(message, "ErreurCleDansContexte");
        }
    }
}
