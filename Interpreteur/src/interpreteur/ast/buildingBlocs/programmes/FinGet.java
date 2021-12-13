package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.objets.Scope;
import interpreteur.as.objets.datatype.ValeurNul;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.List;

public class FinGet extends Programme {

    public FinGet(Executeur executeurInstance) {
        super(executeurInstance);
        Scope.popCurrentScope();
    }

    @Override
    public ValeurNul execute() {
        return new ValeurNul();
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        String nomFermeture = "get_";
        if (!coord.getScope().startsWith(nomFermeture))
            throw new ASErreur.ErreurFermeture(coord.getScope(), "fin get");
        return new Coordonnee(executeurInstance.finScope());
    }

    @Override
    public String toString() {
        return "FinFonction";
    }
}
