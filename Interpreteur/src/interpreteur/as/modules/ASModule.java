package interpreteur.as.modules;

public abstract class ASModule {
    protected ASModuleManager moduleManager;
    public ASModule(ASModuleManager moduleManager) {
        this.moduleManager = moduleManager;
    }
}
