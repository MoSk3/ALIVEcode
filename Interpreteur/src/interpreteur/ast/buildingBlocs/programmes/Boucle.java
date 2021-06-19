package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASErreur;
import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.executeur.Executeur;

import javax.lang.model.type.NullType;
import java.util.ArrayList;
import java.util.HashMap;

public abstract class Boucle extends Programme {
    private final String nomBoucle;

    public static HashMap<String, ArrayList<Boucle>> boucles = new HashMap<>();

    public abstract void sortir();

    public static void sortirScope(String scope) {
        Boucle.boucles.getOrDefault(scope, new ArrayList<>()).forEach(Boucle::sortir);
    }

    protected Boucle(String nomBoucle) {
        this.nomBoucle = nomBoucle;
        boucles.getOrDefault(ASObjet.VariableManager.getCurrentScope(), new ArrayList<>()).add(this);
    }

    public String getNomBoucle() {
        return nomBoucle;
    }

    public static class Sortir extends Programme {
        @Override
        public NullType execute() {
            switch (Executeur.obtenirCoordRunTime().getBlocActuel()) {
                case "pour" -> BouclePour.sortir = true;
                case "repeter" -> BoucleRepeter.sortir = true;
                case "tant_que" -> {
                }
                default -> throw new ASErreur.ErreurSyntaxe("");
            }
            Executeur.obtenirCoordRunTime().recommencerLeBlocActuel();
            return null;
        }
    }

    public static class Continuer extends Programme {
        @Override
        public NullType execute() {
            Executeur.obtenirCoordRunTime().recommencerLeBlocActuel();
            return null;
        }
    }
}
