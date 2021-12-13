package interpreteur.as.modules;

import interpreteur.as.objets.*;
import interpreteur.as.objets.datatype.Texte;
import interpreteur.executeur.Executeur;

public class ModuleTest {
    public static ASModule charger(Executeur executeurInstance) {
        FonctionModule[] fonctionModules = new FonctionModule[]{
                new FonctionModule("dummy", TypeBuiltin.tout.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        //executeurInstance.addData(new Data(Data.Id.AFFICHER).addParam(executeurInstance.getContext()));
                        var context = executeurInstance.getContext();
                        var iotPayload = context.optString("iotPayload");
                        return new Texte(iotPayload);
                    }
                }
        };

        Variable[] variables = new Variable[]{
                new Variable("sonNom", new Texte("hey!"), TypeBuiltin.texte.asType())
                        .setGetter(() -> new Texte("oh!")).setReadOnly()
        };


        return new ASModule(fonctionModules, variables);
    }
}
