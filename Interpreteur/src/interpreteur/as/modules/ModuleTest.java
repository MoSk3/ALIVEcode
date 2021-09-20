package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.executeur.Executeur;

public class ModuleTest extends ASModule {

    public ModuleTest(ASModuleManager moduleManager) {
        super(moduleManager);
    }

    @Override
    public void charger(Executeur executeurInstance) {
        moduleManager.ajouterModule("Test", new ASObjet.Fonction[]{

        });
    }
}
