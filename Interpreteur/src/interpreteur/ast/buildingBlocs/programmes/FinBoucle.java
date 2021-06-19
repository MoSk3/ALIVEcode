package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASErreur;
import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.List;

public class FinBoucle extends Programme {
    private final String nomBoucle;

    public FinBoucle(String nomBoucle) {
        this.nomBoucle = nomBoucle;
    }

    @Override
    public ASObjet<?> execute() {
        Executeur.obtenirCoordRunTime().recommencerLeBlocActuel();
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        String blocActuel = Executeur.obtenirCoordRunTime().getBlocActuel().replaceAll("_", " ");
        if (!blocActuel.equals(nomBoucle)) {

            blocActuel = switch (blocActuel) {
                case "faire" -> "tant que";
                case "sinon" -> "si";
                default -> blocActuel;
            };

            throw new ASErreur.ErreurFermeture(blocActuel,
                    "fin " + nomBoucle, "fin " + blocActuel);

        }
        return Executeur.obtenirCoordRunTime().finBloc();
    }

    @Override
    public String toString() {
        return "FinBoucle";
    }
}