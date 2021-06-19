package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASErreur;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class FinSi extends Programme {
    @Override
    public NullType execute() {
        Executeur.obtenirCoordRunTime().recommencerLeBlocActuel();
        String blocActuel = Executeur.obtenirCoordRunTime().getBlocActuel();
        if (!blocActuel.equals("si") && !blocActuel.equals("sinon"))
            throw new ASErreur.ErreurFermeture(blocActuel.replaceAll("_", " "),
                    "", "fin si");
        Executeur.obtenirCoordRunTime().finBloc();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        String blocActuel = Executeur.obtenirCoordRunTime().getBlocActuel().replaceAll("_", " ");
        if (!blocActuel.equals("si") && !blocActuel.equals("sinon")) {
            throw new ASErreur.ErreurFermeture(blocActuel,
                    "fin si", "fin " + blocActuel);
        }
        return Executeur.obtenirCoordRunTime().finBloc();
    }

    @Override
    public String toString() {
        return "FinSi";
    }
}
