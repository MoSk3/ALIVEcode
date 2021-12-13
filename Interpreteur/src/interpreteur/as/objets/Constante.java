package interpreteur.as.objets;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.expressions.Type;

import java.util.function.Function;
import java.util.function.Supplier;

public class Constante extends Variable {

    public Constante(String nom, ASObjet<?> valeur) {
        super(nom, valeur, new Type("tout"));
    }

    @Override
    public Variable clone() {
        return new interpreteur.as.objets.Constante(obtenirNom(), this.getValeur());
    }

    @Override
    public Variable setSetter(Function<ASObjet<?>, ASObjet<?>> setter) {
        throw new ASErreur.ErreurAssignement("Les constantes ne peuvent pas avoir de setter");
    }

    @Override
    public Variable setGetter(Supplier<ASObjet<?>> getter) {
        throw new ASErreur.ErreurAssignement("Les constantes ne peuvent pas avoir de getter");
    }

    @Override
    public void changerValeur(ASObjet<?> valeur) {
        if (this.getValeur() != null)
            throw new ASErreur.ErreurAssignement("Il est impossible de changer la valeur d'une constante");
        super.changerValeur(valeur);
    }
}
