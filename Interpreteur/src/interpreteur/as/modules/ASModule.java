package interpreteur.as.modules;

import interpreteur.executeur.Executeur;

public abstract class ASModule {
    protected ASModuleManager moduleManager;
    public ASModule(ASModuleManager moduleManager) {
        this.moduleManager = moduleManager;
    }

    abstract public void charger(Executeur executeurInstance);
}
