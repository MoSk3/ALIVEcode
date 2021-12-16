package interpreteur.as.modules.core;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.managers.FonctionManager;
import interpreteur.as.lang.Scope;
import interpreteur.as.lang.ASVariable;
import interpreteur.ast.buildingBlocs.expressions.Type;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


public final record ASModule(ASFonctionModule[] fonctionModules,
                             ASVariable[] variables) {

    public ASModule(ASFonctionModule[] fonctionModules) {
        this(fonctionModules, new ASVariable[]{});
    }

    public ASModule(ASVariable[] variables) {
        this(new ASFonctionModule[]{}, variables);
    }

    public void utiliser(String prefix) {
        FonctionManager.ajouterStructure(prefix);
        for (ASFonctionModule fonctionModule : fonctionModules) {
            Scope.getCurrentScope().declarerVariable(new ASVariable(fonctionModule.getNom(), fonctionModule, new Type(fonctionModule.obtenirNomType())));
        }
        for (ASVariable variable : variables) {
            Scope.getCurrentScope().declarerVariable(variable.clone());
        }
        FonctionManager.retirerStructure();
    }

    public void utiliser(List<String> nomMethodes) {
        for (ASFonctionModule fonctionModule : fonctionModules) {
            if (nomMethodes.contains(fonctionModule.getNom()))
                FonctionManager.ajouterFonction(fonctionModule);
        }
        for (ASVariable variable : variables) {
            if (nomMethodes.contains(variable.obtenirNom())) {
                Scope.getCurrentScope().declarerVariable(variable);
            }
        }
    }

    /**
     * @return un array contenant toutes les fonctions du module
     */
    public ASFonctionModule[] getFonctions() {
        return fonctionModules;
    }

    /**
     * @return un array contenant toutes les variables du module
     */
    public ASVariable[] getVariables() {
        return variables;
    }

    /**
     * @return la liste des noms des fonctions du module
     */
    public List<String> getNomsFonctions() {
        if (fonctionModules.length == 0) return new ArrayList<>();
        return Stream.of(fonctionModules).map(ASFonctionModule::getNom).collect(Collectors.toList());
    }

    /**
     * @return la liste des noms des constantes du module
     */
    public List<String> getNomsVariables() {
        if (variables.length == 0) return new ArrayList<>();
        return Stream.of(variables).map(ASVariable::obtenirNom).collect(Collectors.toList());
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














