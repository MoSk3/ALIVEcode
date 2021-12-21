package interpreteur.as.modules;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.modules.core.ASModule;
import interpreteur.executeur.Executeur;

public class ModuleTest {
    public static ASModule charger(Executeur executeurInstance) {
        ASFonctionModule[] fonctionModules = new ASFonctionModule[]{

        };

        ASVariable[] variables = new ASVariable[]{

        };


        return new ASModule(fonctionModules, variables);
    }
}
