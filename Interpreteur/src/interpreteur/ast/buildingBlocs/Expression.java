package interpreteur.ast.buildingBlocs;



import interpreteur.as.ASObjet;


public interface Expression<T extends ASObjet<?>> {

    /**
     *
     * Appelé au runtime
     */
    T eval();
}
