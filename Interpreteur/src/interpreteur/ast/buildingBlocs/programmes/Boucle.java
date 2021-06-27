package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
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
        boucles.getOrDefault(Executeur.obtenirCoordRunTime().getCoordAsString(), new ArrayList<>()).add(this);
    }

    public String getNomBoucle() {
        return nomBoucle;
    }

    public static class Sortir extends Programme {
        @Override
        public NullType execute() {
            switch (Executeur.obtenirCoordRunTime().getBoucleActuelle()) {
                case "pour" -> BouclePour.sortir = true;
                case "repeter" -> BoucleRepeter.sortir = true;
                case "tant_que" -> BoucleTantQue.sortir = true;
                default -> throw new ASErreur.ErreurSyntaxe("Il faut \u00EAtre dans une boucle pour pouvoir utiliser le mot clef 'sortir'");
            }
            Executeur.obtenirCoordRunTime().recommencerBoucleActuelle();
            return null;
        }
    }

    public static class Continuer extends Programme {
        @Override
        public NullType execute() {
            if (Executeur.obtenirCoordRunTime().getBoucleActuelle() == null) {
                throw new ASErreur.ErreurSyntaxe("Il faut \u00EAtre dans une boucle pour pouvoir utiliser le mot clef 'continuer'");
            }
            Executeur.obtenirCoordRunTime().recommencerBoucleActuelle();
            return null;
        }
    }
}
