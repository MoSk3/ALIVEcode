package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.objets.Scope;
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

    public BoucleTantQue(Expression<?> condition, Executeur executeurInstance) {
        super("tant que", executeurInstance);
        this.condition = condition;
        this.isBoucleFaire = executeurInstance.obtenirCoordRunTime().getBlocActuel().equals("faire");
        this.scope = Scope.makeNewCurrentScope();
    }

    public void sortir() {
        sortir = false;
        firstTime = true;
        if (isBoucleFaire) executeurInstance.obtenirCoordRunTime().finBloc();
        Scope.popCurrentScopeInstance();
    }

    @Override
    public NullType execute() {
        if (firstTime) {
            firstTime = false;
            Scope.pushCurrentScopeInstance(scope.makeScopeInstanceFromCurrentScope());
        }
        if (condition.eval().boolValue() && !sortir) {
            Scope.popCurrentScopeInstance();
            Scope.pushCurrentScopeInstance(scope.makeScopeInstanceFromCurrentScope());
            if (isBoucleFaire)
                executeurInstance.obtenirCoordRunTime().recommencerLeBlocActuel();
            else
                executeurInstance.obtenirCoordRunTime().nouveauBloc("tant_que");

        } else sortir();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        if (isBoucleFaire)
            return coord.finBloc();

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
