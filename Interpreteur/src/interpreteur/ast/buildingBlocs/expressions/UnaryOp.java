package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.programmes.Assigner;

import java.util.function.Function;

public class UnaryOp implements Expression<ASObjet<?>> {

    private final Expression<?> expression;
    private final Operation op;

    public UnaryOp(Expression<?> expression, Operation op) {
        this.expression = expression;
        this.op = op;
    }

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
        ABSOLUE(expr -> expr instanceof ASObjet.Decimal ?
                new ASObjet.Decimal(Math.abs(((ASObjet.Decimal) expr).getValue())) :
                new ASObjet.Entier(Math.abs(((ASObjet.Entier) expr).getValue()))
        ),

        PLUS(expr -> {
            if (expr instanceof ASObjet.Decimal || expr instanceof ASObjet.Entier) {
                return expr;
            } else {
                String nb = expr.getValue().toString();
                try {
                    boolean estDecimal = nb.contains(".");
                    if (estDecimal) return new ASObjet.Decimal(Double.parseDouble(nb));
                    else return new ASObjet.Entier(Integer.parseInt(nb));
                } catch (NumberFormatException ignored) {
                    throw new ASErreur.ErreurType("impossible de convertir '" + nb + "' en nombre decimal");
                }
            }
        }),

        NEGATION(expr -> {
            if (expr instanceof ASObjet.Decimal) {
                return new ASObjet.Decimal(-((ASObjet.Decimal) expr).getValue());
            } else if (expr instanceof ASObjet.Entier) {
                return new ASObjet.Entier(-((ASObjet.Entier) expr).getValue());
            } else {
                String nb = expr.getValue().toString();
                try {
                    boolean estDecimal = nb.contains(".");
                    if (estDecimal) return new ASObjet.Decimal(-Double.parseDouble(nb));
                    else return new ASObjet.Entier(-Integer.parseInt(nb));
                } catch (NumberFormatException ignored) {
                    throw new ASErreur.ErreurType("impossible de convertir '" + nb + "' en nombre decimal");
                }
            }
        }),


        PLUS_PLUS(expr -> {
            if (expr instanceof ASObjet.Variable) {
                return new BinOp((Expression<?>) expr, BinOp.Operation.PLUS, new ValeurConstante(new ASObjet.Entier(1))).eval();
            }
            new Assigner((Expression<?>) expr, new ValeurConstante(new ASObjet.Entier(1)), BinOp.Operation.PLUS).execute();
            return ((Expression<?>) expr).eval();
        }),

        MOINS_MOINS(expr -> {
            if (expr instanceof ValeurConstante) {
                return new BinOp((Expression<?>) expr, BinOp.Operation.MOINS, new ValeurConstante(new ASObjet.Entier(1))).eval();
            }
            new Assigner((Expression<?>) expr, new ValeurConstante(new ASObjet.Entier(1)), BinOp.Operation.MOINS).execute();
            return ((Expression<?>) expr).eval();
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
