package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class Sinon extends Programme {
    @Override
    public NullType execute() {
        Executeur.obtenirCoordRunTime().finBloc();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return Executeur.obtenirCoordRunTime().remplacerBlocActuel("sinon");
    }

    @Override
    public String toString() {
        return "Sinon";
    }
}