package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.Hashtable;
import java.util.List;

public class SinonSi extends Programme {
    private final Expression<?> test;
    private String coord;
    private int num;

    public SinonSi(Expression<?> test) {
        this.test = test;
    }

    @Override
    public NullType execute() {
        Executeur.obtenirCoordRunTime().finBloc();
        return null;
    }

    public void test() {
        Coordonnee previousCoord = new Coordonnee(Executeur.obtenirCoordRunTime().getCoordAsString());
        previousCoord.finBloc();
        Hashtable<String, Programme> scope = Executeur.obtenirCoordCompileDict().get(Executeur.obtenirCoordRunTime().getScope());


        System.out.println(test.eval());
        System.out.println(scope);
        System.out.println(Executeur.obtenirCoordRunTime().getCoordAsString());

        if (test.eval().boolValue()) {
            //Executeur.obtenirCoordRunTime().nouveauBloc(this.coord);
        } else if (scope.containsKey("<1>sinon_si_" + (this.num + 1) + previousCoord.getCoordAsString())) {
            Executeur.obtenirCoordRunTime().remplacerBlocActuel("sinon_si_" + (this.num + 1));
        } else if (scope.containsKey("<1>sinon" + previousCoord.getCoordAsString())) {
            Executeur.obtenirCoordRunTime().remplacerBlocActuel("sinon");
        }
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

        Programme testProgramme = new Programme() {
            @Override
            public Object execute() {
                test();
                return null;
            }
        };

        Executeur.obtenirCoordRunTime().remplacerBlocActuel(this.coord);

        Executeur.obtenirCoordCompileDict()
                .get(Executeur.obtenirCoordRunTime().getScope())
                .put("<1>sinon_si_" + this.num + coord.getCoordAsString(), testProgramme);

        return Executeur.obtenirCoordRunTime();
    }

    @Override
    public String toString() {
        return "Sinon";
    }
}
