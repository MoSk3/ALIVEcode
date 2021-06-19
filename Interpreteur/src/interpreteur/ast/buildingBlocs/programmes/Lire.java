package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.ast.buildingBlocs.expressions.ValeurConstante;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.data_manager.Data;

import javax.lang.model.type.NullType;


public class Lire extends Programme {
    private final Expression<?> message;
    private final String nomVar;

    public Lire(Var var, Expression<?> message) {
        this.nomVar = var.getNom();
        this.message = message == null ? new ValeurConstante(new ASObjet.Texte("")) : message;
    }

    @Override
    public NullType execute() {
        if (Data.response.isEmpty()) {
            throw new ASErreur.StopGetInfo(new Data(Data.Id.GET).addParam("read").addParam(message.eval().getValue().toString()));
        } else {
            ASObjet.VariableManager.ajouterVariable(new ASObjet.Variable(nomVar, new ASObjet.Texte(Data.response.pop()), new Type("tout")));
        }
        return null;
    }
}
