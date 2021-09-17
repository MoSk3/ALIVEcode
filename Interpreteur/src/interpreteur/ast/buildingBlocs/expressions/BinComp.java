package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;


public record BinComp(Expression<?> gauche,
                      Comparateur op,
                      Expression<?> droite) implements Expression<ASObjet.Booleen> {

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
        EGAL((gauche, droite) -> new ASObjet.Booleen(gauche.equals(droite))),

        /**
         * Gere x != y
         */
        PAS_EGAL((gauche, droite) -> new ASObjet.Booleen(!gauche.equals(droite))),

        /**
         * Gere x > y
         */
        PLUS_GRAND((gauche, droite) -> {
            if (!(gauche.getValue() instanceof Number numG && droite.getValue() instanceof Number numD)) {
                throw new ASErreur.ErreurComparaison("Il est impossible de comparer autre chose que des nombres");
            }
            return new ASObjet.Booleen(numG.doubleValue() > numD.doubleValue());
        }),

        /**
         * Gere x < y
         */
        PLUS_PETIT((gauche, droite) -> {
            if (!(gauche.getValue() instanceof Number numG && droite.getValue() instanceof Number numD)) {
                throw new ASErreur.ErreurComparaison("Il est impossible de comparer autre chose que des nombres");
            }
            return new ASObjet.Booleen(numG.doubleValue() < numD.doubleValue());
        }),

        /**
         * Gere x >= y
         */
        PLUS_GRAND_EGAL((gauche, droite) -> {
            if (!(gauche.getValue() instanceof Number numG && droite.getValue() instanceof Number numD)) {
                throw new ASErreur.ErreurComparaison("Il est impossible de comparer autre chose que des nombres");
            }
            return new ASObjet.Booleen(numG.doubleValue() >= numD.doubleValue());
        }),

        /**
         * Gere x <= y
         */
        PLUS_PETIT_EGAL((gauche, droite) -> {
            if (!(gauche.getValue() instanceof Number numG && droite.getValue() instanceof Number numD)) {
                throw new ASErreur.ErreurComparaison("Il est impossible de comparer autre chose que des nombres");
            }
            return new ASObjet.Booleen(numG.doubleValue() <= numD.doubleValue());
        }),

        DANS((gauche, droite) -> {
            if (!(droite instanceof ASObjet.Iterable iterD)) {
                throw new ASErreur.ErreurComparaison("L'op\u00E9rateur 'dans' ne s'applique que sur les \u00E9l\u00E9ments de type 'iterable'");
            }
            return new ASObjet.Booleen(iterD.contient(gauche));
        }),

        PAS_DANS((gauche, droite) -> {
            if (!(droite instanceof ASObjet.Iterable iterD)) {
                throw new ASErreur.ErreurComparaison("L'op\u00E9rateur 'dans' ne s'applique que sur les \u00E9l\u00E9ments de type 'iterable'");
            }
            return new ASObjet.Booleen(!iterD.contient(gauche));
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
