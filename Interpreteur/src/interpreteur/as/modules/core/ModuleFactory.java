package interpreteur.as.modules.core;

import interpreteur.executeur.Executeur;

@FunctionalInterface
public interface ModuleFactory {

    Module charger(Executeur executeurInstance);

}
