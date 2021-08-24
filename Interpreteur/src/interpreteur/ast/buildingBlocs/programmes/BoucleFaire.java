package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.Scope;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class BoucleFaire extends Programme {
    public BoucleFaire() {

    }

    @Override
    public NullType execute() {
        Executeur.obtenirCoordRunTime().nouveauBloc("faire");
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return coord.nouveauBloc("faire");
    }

    @Override
    public String toString() {
        return "BoucleFaire";
    }
}
