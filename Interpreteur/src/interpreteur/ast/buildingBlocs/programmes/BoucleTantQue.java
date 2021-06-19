package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class BoucleTantQue extends Boucle {
    public static boolean sortir = false;
    private final Expression<?> condition;
    private final boolean isBoucleFaire;

    public BoucleTantQue(Expression<?> condition) {
        super("tant que");
        this.condition = condition;
        this.isBoucleFaire = Executeur.obtenirCoordRunTime().getBlocActuel().equals("faire");
    }

    public void sortir() {
        sortir = false;
        if (isBoucleFaire) Executeur.obtenirCoordRunTime().finBloc();
    }

    @Override
    public NullType execute() {
        if (((Boolean) condition.eval().getValue() && !sortir)) {
            if (isBoucleFaire)
                Executeur.obtenirCoordRunTime().recommencerLeBlocActuel();
            else
                Executeur.obtenirCoordRunTime().nouveauBloc("tant_que");

        } else sortir();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        if (isBoucleFaire)
            return Executeur.obtenirCoordRunTime().finBloc();

        return Executeur.obtenirCoordRunTime().nouveauBloc("tant_que");
    }

    @Override
    public String toString() {
        final String repr;
        if (isBoucleFaire) {
            repr = "FinBoucleFaire{" +
                    "condition=" + condition +
                    '}';
        } else {
            repr = "BoucleTantQue{" +
                    "condition=" + condition +
                    '}';
        }
        return repr;
    }
}
