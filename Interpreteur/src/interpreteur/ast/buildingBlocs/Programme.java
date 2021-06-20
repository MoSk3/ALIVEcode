package interpreteur.ast.buildingBlocs;

import interpreteur.executeur.Coordonnee;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.io.Serializable;
import java.net.FileNameMap;
import java.util.List;
import java.util.function.Supplier;

public abstract class Programme implements Serializable {
    private int numLigne = -1;
    /**
     * INDIQUE LA FIN DU PROGRAMME
     */
    public static class ProgrammeFin extends Programme {
        @Override
        public NullType execute() {
            return null;
        }

        @Override
        public String toString() {
            return "'FIN'";
        }
    }

    public int getNumLigne() {
        return numLigne;
    }

    public void setNumLigne(int numLigne) {
        this.numLigne = numLigne;
    }

    public static Programme evalExpression(Expression<?> expression, String toString) {
        return new Programme() {
            @Override
            public Object execute() {
                return expression.eval();
            }

            @Override
            public String toString() {
                return toString;
            }
        };
    }

    /**
     *
     * appelé au runtime
     */
    public abstract Object execute();
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return coord;
    }

    @Override
    public String toString() {
        return "vide";
    }
}
