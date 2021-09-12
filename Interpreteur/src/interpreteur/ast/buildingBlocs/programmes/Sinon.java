package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class Sinon extends Programme {
    public Sinon(Executeur executeurInstance) {
        super(executeurInstance);
    }

    @Override
    public NullType execute() {
        executeurInstance.obtenirCoordRunTime().finBloc();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return executeurInstance.obtenirCoordRunTime().remplacerBlocActuel("sinon");
    }

    @Override
    public String toString() {
        return "Sinon";
    }
}