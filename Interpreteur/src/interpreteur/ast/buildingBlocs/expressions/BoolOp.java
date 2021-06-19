package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;

public class BoolOp implements Expression<ASObjet.Booleen> {
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
    public ASObjet.Booleen eval() {
        return this.op.apply(this.gauche, this.droite);
    }

    public enum Operateur {
        ET((gauche, droite) -> {
            return new ASObjet.Booleen(gauche.getValue() && droite.getValue());
        }),

        OU((gauche, droite) -> {
            return new ASObjet.Booleen(gauche.getValue() || droite.getValue());
        }),

        PAS((gauche, droite) -> {
            return new ASObjet.Booleen(!gauche.getValue());
        });

        private final BiFunction<ASObjet.Booleen, ASObjet.Booleen, ASObjet.Booleen> eval;

        Operateur(BiFunction<ASObjet.Booleen, ASObjet.Booleen, ASObjet.Booleen> eval) {
            this.eval = eval;
        }

        public ASObjet.Booleen apply(Expression<?> gauche, Expression<?> droite) {
            /*
             * TODO erreur si gauche.eval() et/ou droite.eval()~ n'est pas de type ASObjet.Booleen
             */
            ASObjet.Booleen g = (ASObjet.Booleen) gauche.eval();
            ASObjet.Booleen d = (ASObjet.Booleen) droite.eval();
            return this.eval.apply(g, d);
        }
    }


}
