package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;

public class BoolOp implements Expression<ASObjet<?>> {
    private final Expression<?> gauche, droite;
    private final Operateur op;

    public BoolOp(Expression<?> gauche, Operateur op, Expression<?> droite) {
        this.gauche = gauche;
        this.droite = droite;
        this.op = op;
    }

    @Override
    public String toString() {
        return "BoolOp{" +
                "gauche=" + gauche +
                ", droite?=" + droite +
                ", op=" + op +
                '}';
    }

    @Override
    public ASObjet<?> eval() {
        return this.op.apply(this.gauche, this.droite);
    }

    public enum Operateur {
        ET((gauche, droite) -> {
            if (!gauche.boolValue())
                return gauche;
            else
                return droite;
        }),

        OU((gauche, droite) -> {
            if (gauche.boolValue())
                return gauche;
            else
                return droite;
        }),

        PAS((gauche, droite) -> {
            return new ASObjet.Booleen(!gauche.boolValue());
        });

        private final BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval;

        Operateur(BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval) {
            this.eval = eval;
        }

        public ASObjet<?> apply(Expression<?> gauche, Expression<?> droite) {
            /*
             * TODO erreur si gauche.eval() et/ou droite.eval()~ n'est pas de type ASObjet.Booleen
             */
            ASObjet<?> g =  gauche.eval();
            ASObjet<?> d = droite == null ? null : droite.eval();
            return this.eval.apply(g, d);
        }
    }
}
