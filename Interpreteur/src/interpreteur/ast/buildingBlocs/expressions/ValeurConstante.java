package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public class ValeurConstante implements Expression<ASObjet<?>> {
    private final ASObjet<?> val;

    public ValeurConstante(ASObjet<?> val) {
        this.val = val;
    }

    @Override
    public ASObjet<?> eval() {
        return val;
    }

    @Override
    public String toString() {
        return "ValeurConstante{" +
                "val=" + (val instanceof ASObjet.Texte ? "'" + val.toString().replaceAll("'", "\\\\'") + "'" : val) +
                '}';
    }
}


























