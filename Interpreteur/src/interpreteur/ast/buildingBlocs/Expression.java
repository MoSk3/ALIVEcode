package interpreteur.ast.buildingBlocs;

import interpreteur.as.Objets.ASObjet;

import java.io.Serializable;


public interface Expression<T extends ASObjet<?>> extends Serializable {

    /**
     *
     * Appelé au runtime
     */
    T eval();

    class ExpressionVide implements Expression<ASObjet<?>> {

        @Override
        public ASObjet<?> eval() {
            return null;
        }
    }
}
