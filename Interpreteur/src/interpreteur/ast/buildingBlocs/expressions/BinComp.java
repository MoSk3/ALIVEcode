package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;


public class BinComp implements Expression<ASObjet.Booleen> {
    private final Expression<?> gauche, droite;
    private final Comparateur op;

    public BinComp(Expression<?> gauche, Comparateur op, Expression<?> droite) {
        this.gauche = gauche;
        this.droite = droite;
        this.op = op;
    }

    @Override
    public ASObjet.Booleen eval() {
        return this.op.apply(this.gauche, this.droite);
    }

    @Override
    public String toString() {
        return "BinaryOp{" +
                "gauche=" + gauche +
                ", droite=" + droite +
                ", op=" + op +
                '}';
    }

    public enum Comparateur {
        /**
         * Gere x == y
         */
        EGAL((gauche, droite) -> {
            return new ASObjet.Booleen(gauche.getValue().equals(droite.getValue()));
        }),

        /**
         * Gere x != y
         */
        PAS_EGAL((gauche, droite) -> {
            return new ASObjet.Booleen(!gauche.getValue().equals(droite.getValue()));
        }),

        /**
         * Gere x > y
         */
        PLUS_GRAND((gauche, droite) -> {
            return new ASObjet.Booleen(((Number) gauche.getValue()).doubleValue() > ((Number) droite.getValue()).doubleValue());
        }),

        /**
         * Gere x < y
         */
        PLUS_PETIT((gauche, droite) -> {
            return new ASObjet.Booleen(((Number) gauche.getValue()).doubleValue() < ((Number) droite.getValue()).doubleValue());
        }),

        /**
         * Gere x >= y
         */
        PLUS_GRAND_EGAL((gauche, droite) -> {
            return new ASObjet.Booleen(((Number) gauche.getValue()).doubleValue() >= ((Number) droite.getValue()).doubleValue());
        }),

        /**
         * Gere x <= y
         */
        PLUS_PETIT_EGAL((gauche, droite) -> {
            return new ASObjet.Booleen(((Number) gauche.getValue()).doubleValue() <= ((Number) droite.getValue()).doubleValue());
        }),

        DANS((gauche, droite) -> {
            return new ASObjet.Booleen(((ASObjet.Iterable) droite).contient(gauche));
        }),

        PAS_DANS((gauche, droite) -> {
            return new ASObjet.Booleen(!((ASObjet.Iterable) droite).contient(gauche));
        });

        private final BiFunction<ASObjet<?>, ASObjet<?>, ASObjet.Booleen> eval;

        Comparateur(BiFunction<ASObjet<?>, ASObjet<?>, ASObjet.Booleen> eval) {
            this.eval = eval;
        }

        public ASObjet.Booleen apply(Expression<?> gauche, Expression<?> droite) {
            ASObjet<?> g = gauche.eval();
            ASObjet<?> d = droite.eval();
            return this.eval.apply(g, d);
        }
    }
}
