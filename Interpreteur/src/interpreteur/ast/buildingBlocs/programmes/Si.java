package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class Si extends Programme {
    private final Expression<?> test;

    public Si(Expression<?> test) {
        this.test = test;
    }

    @Override
    public NullType execute() {
        if (test.eval().boolValue()) {
            Executeur.obtenirCoordRunTime().nouveauBloc("si");
        } else if (Executeur.leBlocExiste("sinon")) {
            Executeur.obtenirCoordRunTime().nouveauBloc("sinon");
        }
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return Executeur.obtenirCoordRunTime().nouveauBloc("si");
    }

    @Override
    public String transpile(String language) {
        return switch (language) {
            case "java" -> {
               yield "";
            }
            case "python" -> {
                yield "a";
            }
            case "c++", "cpp" -> {
                yield "b";
            }
            default -> throw new IllegalStateException("Unexpected value: " + language);
        };
    }

    @Override
    public String toString() {
        return "Si{" +
                "test=" + test +
                '}';
    }
}
