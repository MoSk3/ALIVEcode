package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.programmes.Assigner;

public class Incrementer implements Expression<ASObjet<?>> {
    private final Expression<?> expr;
    private final byte signe;

    public Incrementer(Expression<?> expr, byte signe) {
        if (expr instanceof Incrementer) {
            throw new ASErreur.ErreurAssignement("Il est impossible de mettre plusieurs incr\u00E9mentations en chaine");
        }
        this.expr = expr;
        this.signe = signe;
    }

    @Override
    public ASObjet<?> eval() {
        if (expr instanceof Var || expr instanceof CreerListe.SousSection.IndexSection) {
            new Assigner(expr, new ValeurConstante(new ASObjet.Entier(signe)), false, BinOp.Operation.PLUS).execute();
            return expr.eval();
        }
        return new BinOp(expr, BinOp.Operation.PLUS, new ValeurConstante(new ASObjet.Entier(signe))).eval();
    }

    @Override
    public String toString() {
        return "Incrementer{" +
                "expr=" + expr +
                ", signe=" + signe +
                '}';
    }
}
