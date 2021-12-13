package interpreteur.as.modules.core;

import interpreteur.as.objets.FonctionModule;
import interpreteur.as.objets.managers.FonctionManager;
import interpreteur.as.objets.Scope;
import interpreteur.as.objets.Variable;
import interpreteur.ast.buildingBlocs.expressions.Type;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


public final record Module(FonctionModule[] fonctionModules,
                           Variable[] variables) {

    public Module(FonctionModule[] fonctionModules) {
        this(fonctionModules, new Variable[]{});
    }

    public Module(Variable[] variables) {
        this(new FonctionModule[]{}, variables);
    }

    public void utiliser(String prefix) {
        FonctionManager.ajouterStructure(prefix);
        for (FonctionModule fonctionModule : fonctionModules) {
            Scope.getCurrentScope().declarerVariable(new Variable(fonctionModule.getNom(), fonctionModule, new Type(fonctionModule.obtenirNomType())));
        }
        for (Variable variable : variables) {
            Scope.getCurrentScope().declarerVariable(variable.clone());
        }
        FonctionManager.retirerStructure();
    }

    public void utiliser(List<String> nomMethodes) {
        for (FonctionModule fonctionModule : fonctionModules) {
            if (nomMethodes.contains(fonctionModule.getNom()))
                FonctionManager.ajouterFonction(fonctionModule);
        }
        for (Variable variable : variables) {
            if (nomMethodes.contains(variable.obtenirNom())) {
                Scope.getCurrentScope().declarerVariable(variable);
            }
        }
    }

    /**
     * @return un array contenant toutes les fonctions du module
     */
    public FonctionModule[] getFonctions() {
        return fonctionModules;
    }

    /**
     * @return un array contenant toutes les variables du module
     */
    public Variable[] getVariables() {
        return variables;
    }

    /**
     * @return la liste des noms des fonctions du module
     */
    public List<String> getNomsFonctions() {
        if (fonctionModules.length == 0) return new ArrayList<>();
        return Stream.of(fonctionModules).map(FonctionModule::getNom).collect(Collectors.toList());
    }

    /**
     * @return la liste des noms des constantes du module
     */
    public List<String> getNomsVariables() {
        if (variables.length == 0) return new ArrayList<>();
        return Stream.of(variables).map(Variable::obtenirNom).collect(Collectors.toList());
    }

    /**
     * @return la liste des noms des constantes du module
     */
    public List<String> getNomsConstantesEtFonctions() {
        List<String> noms = getNomsFonctions();
        noms.addAll(getNomsVariables());
        return noms;
    }

    @Override
    public String toString() {
        return "Module{\n" +
                "fonctions=" + Arrays.toString(fonctionModules) + "\n" +
                ", variables=" + Arrays.toString(variables) + "\n" +
                '}';
    }
}














