package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.Decimal;
import interpreteur.as.lang.datatype.Entier;
import interpreteur.as.lang.datatype.Liste;
import interpreteur.as.lang.datatype.Texte;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.function.BiFunction;

public record BinOp(Expression<?> gauche,
                    Operation op,
                    Expression<?> droite) implements Expression<ASObjet<?>> {

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
        return "BinOp{" +
                "gauche=" + gauche +
                ", op=" + op +
                ", droite=" + droite +
                '}';
    }

    public enum Operation {
        /**
         * Gere x / y
         */
        DIV((gauche, droite) -> {
            if (gauche instanceof Liste lstG && droite instanceof Liste lstD) {
                return new Liste(lstG
                        .getValue()
                        .stream()
                        .filter(element -> !lstD.contient(element))
                        .toArray(ASObjet[]::new));
            }

            if (((Number) droite.getValue()).doubleValue() == 0) {
                throw new ASErreur.ErreurDivisionParZero("Division par z\u00E9ro impossible");
            }
            return new Decimal(((Number) gauche.getValue()).doubleValue() / ((Number) droite.getValue()).doubleValue());
        }, "division") /* remove all dans listes */,

        /**
         * Gere x // y
         */
        DIV_ENTIERE((gauche, droite) -> {
            int result = ((Number) gauche.getValue()).intValue() / ((Number) droite.getValue()).intValue();
            return new Entier(result);
        }, "division enti\u00E8re"),

        /**
         * Gere x % y
         */
        MOD((gauche, droite) -> {
            if (((Number) droite.getValue()).doubleValue() == 0)
                throw new ASErreur.ErreurModuloZero("Modulo par z\u00E9ro impossible");
            double result = ((Number) gauche.getValue()).intValue() % ((Number) droite.getValue()).intValue();
            return new Entier((int) result);
        }, "modulo"),

        /**
         * Gere x - y
         */
        MOINS((gauche, droite) -> {

            if (gauche instanceof Texte txtG && droite instanceof Texte txtD) {
                return new Texte(txtG.getValue().replace(txtD.getValue(), ""));
            }

            if (gauche instanceof Liste lstG) {
                return new Liste(lstG
                        .getValue()
                        .stream()
                        .filter(element -> !element.getValue().equals(droite.getValue())).toArray(ASObjet[]::new));
            }

            double result = ((Number) gauche.getValue()).doubleValue() - ((Number) droite.getValue()).doubleValue();
            return gauche instanceof Entier && droite instanceof Entier ?
                    new Entier((int) result) :
                    new Decimal(result);
        }, "soustraction") /* remove texte */ /* remove liste */,

        /**
         * Gere x * y
         */
        MUL((gauche, droite) -> {
            if (gauche instanceof Texte txtG && droite instanceof Entier intD) {
                return new Texte(txtG.getValue().repeat(intD.getValue()));
            }

            if (gauche instanceof Liste lstG && droite instanceof Entier intD) {
                Liste liste = new Liste();
                for (int i = 0; i < intD.getValue(); i++) {
                    liste.ajouterTout(lstG);
                }
                return liste;
            }

            double result = ((Number) gauche.getValue()).doubleValue() * ((Number) droite.getValue()).doubleValue();
            return gauche instanceof Entier && droite instanceof Entier ?
                    new Entier((int) result) :
                    new Decimal(result);
        }, "multiplication") /* repeat texte */ /* repeat liste */,

        /**
         * Gere x | y
         */
        PIPE((gauche, droite) -> {
            if (gauche instanceof Liste lstG && droite instanceof Liste lstD) {
                return new Liste(lstG.getValue().toArray(ASObjet[]::new)).ajouterTout(lstD);
            }
            throw new RuntimeException();
        }, "union") /* unir listes */,

        /**
         * Gere x + y
         */
        PLUS((gauche, droite) -> {

            if (gauche instanceof Liste lstG) {
                Liste lst = lstG.sousSection(0, lstG.taille());
                lst.ajouterElement(droite);
                System.out.println(lst);
                return lst;
            }

            if (gauche instanceof Texte || droite instanceof Texte) {
                return new Texte(gauche.toString() + droite.toString());
            }

            double result = ((Number) gauche.getValue()).doubleValue() + ((Number) droite.getValue()).doubleValue();
            return gauche instanceof Entier && droite instanceof Entier ?
                    new Entier((int) result) :
                    new Decimal(result);
        }, "addition") /* append */ /* concat */ /* add */,

        /**
         * Gere x ^ y
         */
        POW((gauche, droite) -> {
            double result = Math.pow(((Number) gauche.getValue()).doubleValue(), ((Number) droite.getValue()).doubleValue());
            return gauche instanceof Entier && droite instanceof Entier ?
                    new Entier((int) result) :
                    new Decimal(result);
        }, "exposant"),
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
            } catch (ASErreur.ErreurAliveScript erreurAliveScript) {
                throw erreurAliveScript;
            } catch (Exception e) {
                throw new ASErreur.ErreurType("L'op\u00E9ration '" + nom + "' n'est pas d\u00E9finie pour " +
                        "un \u00E9l\u00E9ment de type '" + g.obtenirNomType() + "' " +
                        "et un \u00E9l\u00E9ment de type '" + d.obtenirNomType() + "'.");
            }
        }
    }
}























