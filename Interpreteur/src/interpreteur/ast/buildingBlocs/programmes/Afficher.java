package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.CreerListe;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

@Deprecated
public class Afficher extends Programme {
    private final Expression<?> expr;

    public Afficher(Expression<?> expr) {
        this.expr = expr;
    }

    @Override
    public Data execute() {
        String msg;
        if (expr instanceof CreerListe.Enumeration) {
            msg = String.join(" ", ((CreerListe.Enumeration) expr)
                    .getExprs()
                    .stream()
                    .map(e -> e.eval().toString())
                    .toArray(String[]::new));
        } else {
            ASObjet<?> val = expr.eval();
            msg = val instanceof ASObjet.Nul ? "nul" : val.toString();
        }
        Executeur.ecrire(msg);
        return new Data(Data.Id.AFFICHER).addParam(msg);
    }

    @Override
    public String toString() {
        return "Afficher{" +
                "expr=" + expr +
                '}';
    }
}
