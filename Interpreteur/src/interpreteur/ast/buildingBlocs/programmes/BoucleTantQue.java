package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.Scope;
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
    private final Scope scope;
    private boolean firstTime = true;

    public BoucleTantQue(Expression<?> condition) {
        super("tant que");
        this.condition = condition;
        this.isBoucleFaire = Executeur.obtenirCoordRunTime().getBlocActuel().equals("faire");
        this.scope = isBoucleFaire ? null : Scope.makeNewCurrentScope();
    }

    public void sortir() {
        sortir = false;
        firstTime = true;
        if (isBoucleFaire)
            Executeur.obtenirCoordRunTime().finBloc();
        else
            Scope.popCurrentScopeInstance();
    }

    @Override
    public NullType execute() {
        if (firstTime) {
            firstTime = false;
            if (!isBoucleFaire) Scope.pushCurrentScopeInstance(scope.makeScopeInstanceFromCurrentScope());
        }
        if (condition.eval().boolValue() && !sortir) {
            if (isBoucleFaire) {
                Executeur.obtenirCoordRunTime().recommencerLeBlocActuel();
            } else {
                Executeur.obtenirCoordRunTime().nouveauBloc("tant_que");
                Scope.popCurrentScopeInstance();
                Scope.pushCurrentScopeInstance(scope.makeScopeInstanceFromCurrentScope());
            }

        } else sortir();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        if (isBoucleFaire) return coord.finBloc();

        return coord.nouveauBloc("tant_que");
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
