package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.List;

public class FinFonction extends Programme {

    @Override
    public ASObjet.Nul execute() {
        return new ASObjet.Nul();
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(Executeur.finScope());
    }

    @Override
    public String toString() {
        return "FinFonction";
    }
}
