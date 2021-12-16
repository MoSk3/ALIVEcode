package interpreteur.as.modules;

import interpreteur.as.modules.builtins.ModuleBuiltin;
import interpreteur.as.modules.core.ASModuleManager;
import interpreteur.as.modules.core.ASModuleFactory;

public enum EnumModule {
    builtins(ModuleBuiltin::charger),
    Ast(ModuleAst::charger),
    Math(ModuleMath::charger),
    Voiture(ModuleVoiture::charger),
    Test(ModuleTest::charger),
    Ai(ModuleAI::charger),
    Iot(ModuleIoT::charger)
    ;

    EnumModule(ASModuleFactory moduleFactory) {
        ASModuleManager.enregistrerModule(this, moduleFactory);
    }
}
