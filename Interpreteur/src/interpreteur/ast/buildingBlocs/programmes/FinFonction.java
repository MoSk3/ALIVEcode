package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.Scope;
import interpreteur.as.lang.datatype.ValeurNul;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.List;

public class FinFonction extends Programme {

    public FinFonction(Executeur executeurInstance) {
        super(executeurInstance);
        Scope.popCurrentScope();
    }

    @Override
    public ValeurNul execute() {
        return new ValeurNul();
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        if (!coord.getScope().startsWith("fonc_"))
            throw new ASErreur.ErreurFermeture(coord.getScope(), "fin fonction");
        return new Coordonnee(executeurInstance.finScope());
    }

    @Override
    public String toString() {
        return "FinFonction";
    }
}
