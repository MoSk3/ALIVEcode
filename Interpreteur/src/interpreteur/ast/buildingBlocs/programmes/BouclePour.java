package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.Iterator;
import java.util.List;

public class BouclePour extends Boucle {
    public static boolean sortir = false;
    private final Var var;
    private final Expression<?> objItere;
    private Iterator<ASObjet<?>> iteration = null;

    public BouclePour(Var var, Expression<?> objItere) {
        super("pour");
        this.var = var;
        this.objItere = objItere;
    }

    public void sortir() {
        ASObjet.VariableManager.retirerVariable(var.getNom());
        iteration = null;
        sortir = false;
    }

    @Override
    public NullType execute() {
        if (iteration == null) {
            if (! (objItere.eval() instanceof ASObjet.Iterable)){
                /*
                TODO Erreur
                 */
            }
            iteration = ((ASObjet.Iterable) objItere.eval()).iter();
        }

        if (iteration.hasNext() && !sortir) {
            ASObjet.Variable.creerOuChangerValeur(var.getNom(), iteration.next(), false);
            Executeur.obtenirCoordRunTime().nouveauBloc("pour");

        } else sortir();

        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return Executeur.obtenirCoordRunTime().nouveauBloc("pour");
    }

    @Override
    public String toString() {
        return "BouclePour{" +
                "var=" + var +
                ", objItere=" + objItere +
                '}';
    }
}
