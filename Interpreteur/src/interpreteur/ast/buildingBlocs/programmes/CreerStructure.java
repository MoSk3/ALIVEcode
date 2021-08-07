package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.tokens.Token;

public class CreerStructure extends Programme {
    private final String nom;

    public CreerStructure(String nom) {
        this.nom = nom;
        ASObjet.FonctionManager.ajouterStructure(nom);
    }

    public String getNom() {
        return nom;
    }

    @Override
    public Object execute() {
        return null;
    }

    @Override
    public String toString() {
        return "CreerStructure{" +
                "nom='" + nom + '\'' +
                '}';
    }
}
