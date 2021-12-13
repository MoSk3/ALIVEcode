package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.lang.ASObjet;
import interpreteur.as.lang.datatype.Decimal;
import interpreteur.as.lang.datatype.Entier;
import interpreteur.as.lang.datatype.Nombre;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.Function;

public record UnaryOp(Expression<?> expression,
                      Operation op) implements Expression<ASObjet<?>> {

    @Override
    public String toString() {
        return "UnaryOp{" +
                "expression=" + expression +
                ", op=" + op +
                '}';
    }

    @Override
    public ASObjet<?> eval() {
        ASObjet<?> result = null;
        try {
            result = this.op.apply(this.expression);
        } catch (ClassCastException err) {
            // TODO lancer erreur d'arithmétique
        }
        return result;
    }


    public enum Operation {
        /**
         * Gere |x|
         */
        ABSOLUE(expr -> expr instanceof Decimal decimal ?
                new Decimal(Math.abs(decimal.getValue())) :
                new Entier(Math.abs(((Entier) expr).getValue()))
        ),

        PLUS(expr -> {
            if (expr instanceof Nombre) {
                return expr;
            } else {
                String nb = expr.getValue().toString();
                return Nombre.parse(expr);
                // obsolete try {
                //     boolean estDecimal = nb.contains(".");
                //     if (estDecimal) return new ASObjet.Decimal(Double.parseDouble(nb));
                //     else return new ASObjet.Entier(Integer.parseInt(nb));
                // } catch (NumberFormatException ignored) {
                //     throw new ASErreur.ErreurType("Il est impossible de convertir '" + nb + "' en nombre decimal");
                // }
            }
        }),

        NEGATION(expr -> {
            if (expr instanceof Decimal decimal) {
                return new Decimal(-decimal.getValue());
            } else if (expr instanceof Entier entier) {
                return new Entier(-entier.getValue());
            } else {
                String nb = expr.getValue().toString();
                try {
                    boolean estDecimal = nb.contains(".");
                    if (estDecimal) return new Decimal(-Double.parseDouble(nb));
                    else return new Entier(-Integer.parseInt(nb));
                } catch (NumberFormatException ignored) {
                    throw new ASErreur.ErreurType("impossible de convertir '" + nb + "' en nombre decimal");
                }
            }
        }),

        ;

        private final Function<ASObjet<?>, ASObjet<?>> eval;

        Operation(Function<ASObjet<?>, ASObjet<?>> eval) {
            this.eval = eval;
        }

        public ASObjet<?> apply(Expression<?> expression) {
            ASObjet<?> expr = expression.eval();
            return this.eval.apply(expr);
        }

    }


}
