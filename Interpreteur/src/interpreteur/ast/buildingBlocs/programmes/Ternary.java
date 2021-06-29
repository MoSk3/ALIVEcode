package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public class Ternary implements Expression<ASObjet<?>> {
    private final Expression<?> test, gauche, droite;

    public Ternary(Expression<?> test, Expression<?> gauche, Expression<?> droite) {
        this.test = test;
        this.droite = droite;
        this.gauche = gauche;
    }

    @Override
    public ASObjet<?> eval() {
        if (test.eval().boolValue()) {
            return gauche.eval();
        } else {
            return droite.eval();
        }
    }

    @Override
    public String toString() {
        return "Ternary{" +
                "test=" + test +
                ", gauche=" + gauche +
                ", droite=" + droite +
                '}';
    }
}
