package interpreteur.as.modules.core;

import interpreteur.executeur.Executeur;

@FunctionalInterface
public interface ASModuleFactory {

    ASModule charger(Executeur executeurInstance);

}
