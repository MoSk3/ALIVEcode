package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.lang.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.datatype.*;
import interpreteur.ast.buildingBlocs.Expression;

public record Suite(Expression<?> debut,
                    Expression<?> fin,
                    Expression<?> bond) implements Expression<Liste> {

    private static final String alphabet = "abcdefghijklmnopqrstuvwxyz";

    public Suite(Expression<?> debut, Expression<?> fin, Expression<?> bond) {
        this.debut = debut;
        this.fin = fin;
        this.bond = bond == null ? new ValeurConstante(new Entier(1)) : bond;
    }

    private void suiteValideOrThrow(double debutValue, double finValue, double bondValue) {
        if (bondValue == 0) {
            throw new ASErreur.ErreurSuite("Suite impossible : bond de 0");
        }
        if (debutValue > finValue && 0 < bondValue) {
            /*
             * Suite impossible
             */
            throw new ASErreur.ErreurSuite("Suite impossible : la valeur de " +
                    "d\u00E9but est plus grande que la valeur de fin et le bond est positif");
        }
        if (debutValue < finValue && 0 > bondValue) {
            /*
             * Suite impossible
             */
            throw new ASErreur.ErreurSuite("Suite impossible : la valeur de " +
                    "d\u00E9but est plus petite que la valeur de fin et le bond est n\u00E9gatif");
        }
    }

    @Override
    public Liste eval() {
        ASObjet<?> debut = this.debut.eval(), fin = this.fin.eval(), bond = this.bond.eval();

        Liste suite = new Liste();

        if (debut instanceof Nombre && fin instanceof Nombre && bond instanceof Nombre) {

            boolean asDouble = debut instanceof Decimal || fin instanceof Decimal || bond instanceof Decimal;

            final double debutValue = ((Number) debut.getValue()).doubleValue(),
                    finValue = ((Number) fin.getValue()).doubleValue(),
                    bondValue = ((Number) bond.getValue()).doubleValue();

            suiteValideOrThrow(debutValue, finValue, bondValue);

            if (debutValue == finValue) {
                suite.ajouterElement(Nombre.cast(debutValue));

            } else if (asDouble) {
                for (double i = debutValue; debutValue <= finValue ? i <= finValue : i >= finValue; i += bondValue) {
                    suite.ajouterElement(new Decimal(i));
                }
            } else {
                for (double i = debutValue; debutValue <= finValue ? i <= finValue : i >= finValue; i += bondValue) {
                    suite.ajouterElement(new Entier(i));
                }
            }

        } else if (debut instanceof Texte && fin instanceof Texte && bond instanceof Entier) {
            final int debutValue = alphabet.indexOf(((String) debut.getValue()).toLowerCase()),
                    finValue = alphabet.indexOf(((String) fin.getValue()).toLowerCase()),
                    bondValue = (Integer) bond.getValue();

            if ((((String) debut.getValue()).length() > 1 || ((String) fin.getValue()).length() > 1)
                    || (debutValue == -1 || finValue == -1)) {

                throw new ASErreur.ErreurSuite("Suite impossible : les suites ne peuvent \u00EAtre form\u00E9es " +
                        "qu'avec des lettres.");
            }

            suiteValideOrThrow(debutValue, finValue, bondValue);

            boolean isUpperCase = !((String) debut.getValue()).toLowerCase().equals(debut.getValue());

            String alphabet = isUpperCase ? Suite.alphabet.toUpperCase() : Suite.alphabet;

            if (((String) debut.getValue()).equalsIgnoreCase(((String) fin.getValue()))) {
                suite.ajouterElement(new Texte(alphabet.charAt(debutValue)));
            } else {
                for (int s = debutValue; debutValue <= finValue ? s <= finValue : s >= finValue; s += bondValue) {
                    suite.ajouterElement(new Texte(alphabet.charAt(s)));
                }
            }
        } else {
            throw new ASErreur.ErreurSuite("Suite entre '" + debut.getValue() + "' et '" + fin.getValue() + "' impossible");
        }
        return suite;
    }

    @Override
    public String toString() {
        return "Suite{" +
                "debut=" + debut +
                ", fin=" + fin +
                ", bond=" + bond +
                '}';
    }
}















