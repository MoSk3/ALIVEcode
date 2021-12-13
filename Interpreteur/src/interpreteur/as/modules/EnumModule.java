package interpreteur.as.modules;

import interpreteur.as.modules.core.ASModuleManager;
import interpreteur.as.modules.core.ModuleFactory;

public enum EnumModule {
    builtins(ModuleBuiltins::charger),
    Ast(ModuleAst::charger),
    Math(ModuleMath::charger),
    Voiture(ModuleVoiture::charger),
    Test(ModuleTest::charger),
    Ai(ModuleAI::charger),
    Iot(ModuleIoT::charger)
    ;

    EnumModule(ModuleFactory moduleFactory) {
        ASModuleManager.enregistrerModule(this, moduleFactory);
    }
}
