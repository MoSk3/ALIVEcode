package interpreteur.as.lang.managers;

import interpreteur.as.lang.FonctionModule;
import interpreteur.as.lang.Scope;
import interpreteur.as.lang.Variable;
import interpreteur.ast.buildingBlocs.expressions.Type;

public class FonctionManager {

    private static String structure = "";

    // met la fonction dans le dictionnaire de fonction et cree enregistre la fonction dans une Variable
    // pour que le code puisse la retrouver plus tard
    public static void ajouterFonction(FonctionModule fonctionModule) {
        Scope.getCurrentScope().declarerVariable(new Variable(fonctionModule.getNom(), fonctionModule, new Type(fonctionModule.obtenirNomType())));
        //VariableManager.ajouterConstante(new Constante(fonction.getNom(), fonction));
        //fonction.nom = ajouterDansStructure(fonction.getNom());
    }

    public static String obtenirStructure() {
        return structure;
    }

    public static String ajouterDansStructure(String element) {
        return (structure.isBlank() ? "" : structure + ".") + element;
    }

    public static void ajouterStructure(String nomStruct) {
        if (nomStruct == null) return;
        structure += (structure.isBlank() ? "" : ".") + nomStruct;
    }

    public static void retirerStructure() {
        structure = structure.contains(".") ? structure.substring(0, structure.lastIndexOf(".")) : "";

    }

    public static void reset() {
        structure = "";
    }
}
