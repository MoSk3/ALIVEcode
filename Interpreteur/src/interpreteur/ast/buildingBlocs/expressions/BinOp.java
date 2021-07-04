package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;
import java.util.function.Predicate;

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
        }, "addition"),

        /**
         * Gere x - y
         */
        MOINS((gauche, droite) -> {

            /* remove texte */
            if (gauche instanceof ASObjet.Texte && droite instanceof ASObjet.Texte) {
                return new ASObjet.Texte(String.valueOf(gauche.getValue()).replace(((ASObjet.Texte) droite).getValue(), ""));
            }

            /* remove liste */
            if (gauche instanceof ASObjet.Liste) {
                return new ASObjet.Liste(((ASObjet.Liste) gauche).getValue().stream().filter(element -> !element.getValue().equals(droite.getValue())).toArray(ASObjet[]::new));
            }

            double result = ((Number) gauche.getValue()).doubleValue() - ((Number) droite.getValue()).doubleValue();
            return gauche instanceof ASObjet.Entier && droite instanceof ASObjet.Entier ?
                    new ASObjet.Entier((int) result) :
                    new ASObjet.Decimal(result);
        }, "soustraction"),

        /**
         * Gere x * y
         */
        MUL((gauche, droite) -> {
            /* repeat texte */
            if (gauche instanceof ASObjet.Texte && droite instanceof ASObjet.Entier) {
                return new ASObjet.Texte(gauche.toString().repeat((Integer) droite.getValue()));
            }

            /* repeat liste */
            if (gauche instanceof ASObjet.Liste && droite instanceof ASObjet.Entier) {
                ASObjet.Liste liste = new ASObjet.Liste();
                for (int i = 0; i < ((ASObjet.Entier) droite).getValue(); i++) {
                    liste.ajouterTout((ASObjet.Liste) gauche);
                }
                return liste;
            }

            double result = ((Number) gauche.getValue()).doubleValue() * ((Number) droite.getValue()).doubleValue();
            return gauche instanceof ASObjet.Entier && droite instanceof ASObjet.Entier ?
                    new ASObjet.Entier((int) result) :
                    new ASObjet.Decimal(result);
        }, "multiplication"),

        /**
         * Gere x / y
         */
        DIV((gauche, droite) -> {
            /* remove all dans listes */
            if (gauche instanceof ASObjet.Liste && droite instanceof ASObjet.Liste) {
                return new ASObjet.Liste(((ASObjet.Liste) gauche)
                        .getValue()
                        .stream()
                        .filter(element -> !((ASObjet.Liste) droite).contient(element))
                        .toArray(ASObjet[]::new));
            }

            if (((Number) droite.getValue()).doubleValue() == 0){
                throw new ASErreur.ErreurDivisionParZero("Division par z\u00E9ro impossible");
            }
            return new ASObjet.Decimal(((Number) gauche.getValue()).doubleValue() / ((Number) droite.getValue()).doubleValue());
        }, "division"),

        /**
         * Gere x // y
         */
        DIV_ENTIERE((gauche, droite) -> {
            int result = ((Number) gauche.getValue()).intValue() / ((Number) droite.getValue()).intValue();
            return new ASObjet.Entier(result);
        }, "division enti\u00E8re"),

        /**
         * Gere x ^ y
         */
        POW((gauche, droite) -> {
            double result = Math.pow(((Number) gauche.getValue()).doubleValue(), ((Number) droite.getValue()).doubleValue());
            return gauche instanceof ASObjet.Entier && droite instanceof ASObjet.Entier ?
                    new ASObjet.Entier((int) result) :
                    new ASObjet.Decimal(result);
        }, "exposant"),

        /**
         * Gere x % y
         */
        MOD((gauche, droite) -> {
            if (((Number) droite.getValue()).doubleValue() == 0)
                throw new ASErreur.ErreurModuloZero("Modulo par z\u00E9ro impossible");
            double result = ((Number) gauche.getValue()).intValue() % ((Number) droite.getValue()).intValue();
            return new ASObjet.Entier((int) result);
        }, "modulo"),

        /**
         * Gere x | y
         */
        PIPE((gauche, droite) -> {
            /* unir listes */
            if (gauche instanceof ASObjet.Liste && droite instanceof ASObjet.Liste) {
                return new ASObjet.Liste((ASObjet.Liste) gauche).ajouterTout((ASObjet.Liste) droite);
            }
            throw new ASErreur.ErreurAliveScript("", "");
        }, "union"),
        ;

        private final BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval;
        private final String nom;

        Operation(BiFunction<ASObjet<?>, ASObjet<?>, ASObjet<?>> eval, String nom) {
            this.eval = eval;
            this.nom = nom;
        }

        public ASObjet<?> apply(Expression<?> gauche, Expression<?> droite) {
            ASObjet<?> g = gauche.eval();
            ASObjet<?> d = droite.eval();
            try {
                return this.eval.apply(g, d);
            } catch (Exception e) {
                throw new ASErreur.ErreurType("L'op\u00E9ration '" + nom + "' n'est pas d\u00E9finie pour " +
                        "un \u00E9l\u00E9ment de type '" + g.obtenirNomType() + "' " +
                        "et un \u00E9l\u00E9ment de type '" + d.obtenirNomType() + "'.");
            }
        }
    }
}























