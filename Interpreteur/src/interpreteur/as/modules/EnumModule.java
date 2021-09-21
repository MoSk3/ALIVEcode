package interpreteur.as.modules;

public enum EnumModule {
    builtins(ModuleBuiltins::charger),
    AST(ModuleAst::charger),
    Math(ModuleMath::charger),
    Voiture(ModuleVoiture::charger),
    Dict(ModuleDict::charger),
    Test(ModuleTest::charger)
    ;

    EnumModule(ModuleFactory moduleFactory) {
        ASModuleManager.enregistrerModule(this, moduleFactory);
    }
}
