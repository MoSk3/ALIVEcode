package interpreteur.as.modules;

public enum EnumModule {
    builtins(ModuleBuiltins::charger),
    Ast(ModuleAst::charger),
    Math(ModuleMath::charger),
    Voiture(ModuleVoiture::charger),
    Dict(ModuleDict::charger),
    Test(ModuleTest::charger),
    Ai(ModuleAI::charger),
    IoT(ModuleIoT::charger)
    ;

    EnumModule(ModuleFactory moduleFactory) {
        ASModuleManager.enregistrerModule(this, moduleFactory);
    }
}
