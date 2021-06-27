package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;

public class BinOp implements Expression<ASObjet<?>> {
    private final Expression<?> gauche, droite;
    private final BinOp.Operation op;

    public BinOp(Expression<?> gauche, BinOp.Operation op, Expression<?> droite) {
        this.gauche = gauche;
        this.droite = droite;
        this.op = op;
    }

    @Override
    public ASObjet<?> eval() {
        ASObjet<?> result = null;
        try {
            result = this.op.apply(this.gauche, this.droite);
        } catch (ClassCastException err) {
            // TODO lancer erreur d'arithmétique
        }
        return result;
    }

    @Override
    public String toString() {
        return "BinaryOp{" +
                "gauche=" + gauche +
                ", droite=" + droite +
                ", op=" + op +
                '}';
    }

    public enum Operation {
        /**
         * Gere x + y
         */
        PLUS((gauche, droite) -> {

            /* append */
            if (gauche instanceof ASObjet.Liste) {
                ASObjet.Liste lst = ((ASObjet.Liste) gauche).sousSection(0, ((ASObjet.Liste) gauche).taille());
                lst.ajouterElement(droite);
                return lst;
            }

            /* concat */
            if (gauche instanceof ASObjet.Texte || droite instanceof ASObjet.Texte) {
                return new ASObjet.Texte(gauche.toString() + droite.toString());
            }

            /* add */
            double result = ((Number) gauche.getValue()).doubleValue() + ((Number) droite.getValue()).doubleValue();
            return gauche instanceof ASObjet.Entier && droite instanceof ASObjet.Entier ?
                    new ASObjet.Entier((int) result) :
                    new ASObjet.Decimal(result);
        }),

        /**
         * Gere x - y
         */
        MOINS((gauche, droite) -> {

            /* concat */
            if (gauche instanceof ASObjet.Texte && droite instanceof ASObjet.Texte) {
                return new ASObjet.Texte(String.valueOf(gauche.getValue()).replace(((ASObjet.Texte) droite).getValue(), ""));
            }

            /* remove */
            if (gauche instanceof ASObjet.Liste) {
                return new ASObjet.Liste(((ASObjet.Liste) gauche).getValue().stream().filter(element -> !element.getValue().equals(droite.getValue())).toArray(ASObjet[]::new));
            }

            double result = ((Number) gauche.getValue()).doubleValue() - ((Number) droite.getValue()).doubleValue();
            return gauche instanceof ASObjet.Entier && droite instanceof ASObjet.Entier ?
                    new ASObjet.Entier((int) result) :
                    new ASObjet.Decimal(result);
        }),

        /**
         * Gere x * y
         */
        MUL((gauche, droite) -> {
            /* concat */
            if (gauche instanceof ASObjet.Texte && droite instanceof ASObjet.Entier) {
                return new ASObjet.Texte(gauche.toString().repeat((Integer) droite.getValue()));
            }
            double result = ((Number) gauche.getValue()).doubleValue() * ((Number) droite.getValue()).doubleValue();
            return gauche instanceof ASObjet.Entier && droite instanceof ASObjet.Entier ?
                    new ASObjet.Entier((int) result) :
                    new ASObjet.Decimal(result);
        }),

        /**
         * Gere x / y
         */
        DIV((gauche, droite) -> {
            if (((Number) droite.getValue()).doubleValue() == 0) throw new ASErreur.ErreurDivisionParZero("Division par z\u00E9ro impossible");
            return new ASObjet.Decimal(((Number) gauche.getValue()).doubleValue() / ((Number) droite.getValue()).doubleValue());
        }),

        /**
         * Gere x // y
         */
        DIV_ENTIERE((gauche, droite) -> {
            int result = ((Number) gauche.getValue()).intValue() / ((Number) droite.getValue()).intValue();
            return new ASObjet.Entier(result);
        }),

        /**
         * Gere x ^ y
         */
        POW((gauche, droite) -> {
            double result = Math.pow(((Number) gauche.getValue()).doubleValue(), ((Number) droite.getValue()).doubleValue());
            return gauche instanceof ASObjet.Entier && droite instanceof ASObjet.Entier ?
                    new ASObjet.Entier((int) result) :
                    new ASObjet.Decimal(result);
        }),

        /**
         * Gere x % y
         */
        MOD((gauche, droite) -> {
            if (((Number) droite.getValue()).doubleValue() == 0) throw new ASErreur.ErreurModuloZero("Modulo par z\u00E9ro impossible");
            double result = ((Number) gauche.getValue()).intValue() % ((Number) droite.getValue()).intValue();
            return new ASObjet.Entier((int) result);
        });

        private final BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval;

        Operation(BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval) {
            this.eval = eval;
        }

        public ASObjet<?> apply(Expression<?> gauche, Expression<?> droite) {
            ASObjet<?> g = gauche.eval();
            ASObjet<?> d = droite.eval();
            return this.eval.apply(g, d);
        }
    }
}























