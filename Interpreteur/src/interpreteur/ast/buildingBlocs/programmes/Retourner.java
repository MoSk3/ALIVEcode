package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;

public class Retourner extends Programme {
    private final Expression<?> expr;

    public Retourner(Expression<?> expr) {
        super(null);
        this.expr = expr;
    }

    @Override
    public ASObjet<?> execute() {
        return expr.eval();
    }

    @Override
    public String toString() {
        return "Retourner{" +
                "expr=" + expr +
                '}';
    }
}
