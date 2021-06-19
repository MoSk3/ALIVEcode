package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.data_manager.Data;
import interpreteur.data_manager.DataVoiture;
import interpreteur.tokens.Token;


public class MethodeMoteur extends Programme {
    private final String nom;
    private final Expression<?> valeur;

    public MethodeMoteur(String nom, Expression<?> valeur) {
        this.nom = nom;
        this.valeur = valeur;
    }

    @Override
    public Object execute() {
        Double valeur = this.valeur != null ? ((Number) this.valeur.eval().getValue()).doubleValue() : 0;
        double dodo = 0;
        DataVoiture.dataVoitureHasChanged();

        Data.Id id = switch (nom) {
            case "AVANCER" -> {
                // avancer avec moteur
                dodo = valeur;
                yield Data.Id.AVANCER;
            }

            case "RECULER" -> {
                // reculer avec moteur
                dodo = valeur;
                yield Data.Id.RECULER;
            }

            case "ARRETER" -> // arreter avec moteur
                    Data.Id.ARRETER;

            case "TOURNER_DROITE" -> Data.Id.TOURNER_DROITE;
            case "TOURNER_GAUCHE" -> Data.Id.TOURNER_GAUCHE;

            case "TOURNER" -> // tourner a droite avec moteur
                    Data.Id.TOURNER;

            default -> throw new IllegalStateException("Unexpected value: " + nom);
        };

        return new Data(id).addParam(valeur).addDodo(dodo);
    }
}
