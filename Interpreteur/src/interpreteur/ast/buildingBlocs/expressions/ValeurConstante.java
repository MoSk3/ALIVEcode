package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.objets.ASObjet;
import interpreteur.as.objets.datatype.Texte;
import interpreteur.ast.buildingBlocs.Expression;

public record ValeurConstante(ASObjet<?> val) implements Expression<ASObjet<?>> {

    @Override
    public ASObjet<?> eval() {
        return val;
    }

    @Override
    public String toString() {
        return "ValeurConstante{" +
                "val=" + (val instanceof Texte ? "'" + val.toString().replaceAll("'", "\\\\'") + "'" : val) +
                '}';
    }
}


























