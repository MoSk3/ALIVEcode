package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.List;

public class SinonSi extends Programme {
    private final Expression<?> test;
    private String coord;
    private int num;

    public SinonSi(Expression<?> test, Executeur executeurInstance) {
        super(executeurInstance);
        this.test = test;
    }

    @Override
    public NullType execute() {
        assert executeurInstance != null;
        executeurInstance.obtenirCoordRunTime().finBloc();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        String blocActuel = coord.getBlocActuel();

        if (blocActuel.startsWith("sinon_si_")) {
            int num = Integer.parseInt(blocActuel.replace("sinon_si_", ""));
            this.num = num + 1;
        } else if (blocActuel.startsWith("si")) {
            this.num = 1;
        } else {
            throw new ASErreur.ErreurSyntaxe("Un bloc 'sinon si' doit obligatoirement suivre un bloc 'si' ou un autre bloc 'sinon si'");
        }
        this.coord = "sinon_si_" + this.num;

        SinonSiTest sinonSiTest = new SinonSiTest(this);

        coord = executeurInstance.obtenirCoordRunTime();
        coord.finBloc();

        executeurInstance.obtenirCoordCompileDict()
                .get(executeurInstance.obtenirCoordRunTime().getScope())
                .put("<" + this.num + ">sinon_si_test" + coord.toString(), sinonSiTest);

        executeurInstance.obtenirCoordRunTime().nouveauBloc(this.coord);

        return executeurInstance.obtenirCoordRunTime();
    }

    @Override
    public String toString() {
        return "SinonSi{" +
                "test=" + test +
                ", coord='" + coord + '\'' +
                ", num=" + num +
                '}';
    }

    private static class SinonSiTest extends Programme {
        final SinonSi parent;

        SinonSiTest(SinonSi parent) {
            this.parent = parent;
        }

        @Override
        public Object execute() {
            Coordonnee coord = executeurInstance.obtenirCoordRunTime();
            coord.finBloc();
            if (this.parent.test.eval().boolValue()) {
                coord.nouveauBloc("sinon_si_" + this.parent.num);
            } else if (executeurInstance.laCoordExiste("<" + (this.parent.num + 1) + ">sinon_si_test")) {
                coord.setCoord("<" + this.parent.num + ">sinon_si_test" + coord.toString());
            } else if (executeurInstance.leBlocExiste("sinon")) {
                coord.nouveauBloc("sinon");
            }
            return null;
        }

        @Override
        public String toString() {
            return "SinonSiTest{" +
                    "parent=" + parent +
                    '}';
        }
    }
}

























