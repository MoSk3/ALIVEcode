package interpreteur.ast.buildingBlocs.programmes;

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

    public BoucleRepeter(Expression<?> nbFois) {
        super("repeter");
        this.nbFois = nbFois;
    }

    public void sortir() {
        current = 0;
        end = null;
        sortir = false;
    }

    @Override
    public NullType execute() {
        if (end == null) end = (Integer) nbFois.eval().getValue();
        if (current++ < end && !sortir) Executeur.obtenirCoordRunTime().nouveauBloc("repeter");
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
