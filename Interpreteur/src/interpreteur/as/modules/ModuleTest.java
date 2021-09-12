package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;

public class ModuleTest extends ASModule {

    public ModuleTest(ASModuleManager moduleManager) {
        super(moduleManager);
    }

    @Override
    public void charger() {
        moduleManager.ajouterModule("Test", new ASObjet.Fonction[]{

        });
    }
}
