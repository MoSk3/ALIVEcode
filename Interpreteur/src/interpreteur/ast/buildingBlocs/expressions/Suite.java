package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.ASErreur;
import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public class Suite implements Expression<ASObjet.Liste> {

    private static final String alphabet = "abcdefghijklmnopqrstuvwxyz";

    private final Expression<?> debut, fin, bond;

    public Suite(Expression<?> debut, Expression<?> fin, Expression<?> bond) {
        this.debut = debut;
        this.fin = fin;
        this.bond = bond == null ? new ValeurConstante(new ASObjet.Entier(1)) : bond;
    }


    @Override
    public ASObjet.Liste eval() {
        ASObjet<?> debut = this.debut.eval(), fin = this.fin.eval(), bond = this.bond.eval();

        ASObjet.Liste suite = new ASObjet.Liste();

        if (debut instanceof ASObjet.Nombre && fin instanceof ASObjet.Nombre && bond instanceof ASObjet.Nombre) {

            boolean asDouble = debut instanceof ASObjet.Decimal || fin instanceof ASObjet.Decimal || bond instanceof ASObjet.Decimal;

            final double debutValue = ((Number) debut.getValue()).doubleValue(),
                    finValue = ((Number) fin.getValue()).doubleValue(),
                    bondValue = ((Number) bond.getValue()).doubleValue();

            if (debutValue > finValue && 0 < bondValue) {
                /*
                 * Suite impossible
                 */
                throw new ASErreur.ErreurSuite("Suite impossible : debutValue > finValue && 0 < bondValue");
            }
            if (asDouble) {
                for (double i = debutValue; debutValue < finValue ? i <= finValue : i >= finValue; i += bondValue) {
                    suite.ajouterElement(new ASObjet.Decimal(i));
                }
            } else {
                for (double i = debutValue; debutValue < finValue ? i <= finValue : i >= finValue; i += bondValue) {
                    suite.ajouterElement(new ASObjet.Entier(i));
                }
            }

        } else if (debut instanceof ASObjet.Texte && fin instanceof ASObjet.Texte && bond instanceof ASObjet.Entier) {
            final int debutValue = alphabet.indexOf(((String) debut.getValue()).toLowerCase()),
                    finValue = alphabet.indexOf(((String) fin.getValue()).toLowerCase()),
                    bondValue = (Integer) bond.getValue();

            if ((((String) debut.getValue()).length() > 1 || ((String) fin.getValue()).length() > 1)
                    || (debutValue == -1 || finValue == -1)
                    || (debutValue > finValue && 0 < bondValue)) {

                throw new ASErreur.ErreurSuite("Suite impossible");
            }

            boolean isUpperCase = !((String) debut.getValue()).toLowerCase().equals(debut.getValue());

            String alphabet = isUpperCase ? Suite.alphabet.toUpperCase() : Suite.alphabet;
            for (int s = debutValue; debutValue < finValue ? s <= finValue : s >= finValue; s += bondValue) {
                suite.ajouterElement(new ASObjet.Texte(alphabet.charAt(s)));
            }
        } else {
            throw new ASErreur.ErreurSuite("Suite impossible");
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















