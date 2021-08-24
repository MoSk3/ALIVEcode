package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.Scope;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class BoucleRepeter extends Boucle {
    public static boolean sortir = false;

    private final Expression<?> nbFois;
    private Integer end = null;
    private int current = 0;
    private final Scope scope;

    public BoucleRepeter(Expression<?> nbFois) {
        super("repeter");
        this.nbFois = nbFois;
        this.scope = Scope.makeNewCurrentScope();
    }

    public void sortir() {
        current = 0;
        end = null;
        sortir = false;
        Scope.popCurrentScopeInstance();
    }

    @Override
    public NullType execute() {
        // first time
        if (end == null) {
            Scope.pushCurrentScopeInstance(this.scope.makeScopeInstanceFromCurrentScope());
            end = (Integer) nbFois.eval().getValue();
        }

        // other times
        if (current++ < end && !sortir) {
            Scope.popCurrentScopeInstance();
            Scope.pushCurrentScopeInstance(this.scope.makeScopeInstanceFromCurrentScope());
            Executeur.obtenirCoordRunTime().nouveauBloc("repeter");
        }
        else sortir();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return Executeur.obtenirCoordRunTime().nouveauBloc("repeter");
    }

    @Override
    public String toString() {
        return "BoucleRepeter{" +
                "nbFois=" + nbFois +
                '}';
    }
}
