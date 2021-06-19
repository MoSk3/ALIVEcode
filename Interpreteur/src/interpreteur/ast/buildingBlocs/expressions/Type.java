package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.ASErreur;
import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public class Type implements Expression<ASObjet<?>> {

    private final String nom;

    public Type(String nom) {
        this.nom = nom;
    }

    public String getNom() {
        return nom;
    }

    @Override
    public ASObjet<?> eval() {
        ASObjet.Variable var;
        if ((var = ASObjet.VariableManager.obtenirVariable(this.getNom())) != null) {
            return var.obtenirValeur();
        }
        throw new ASErreur.ErreurType("Il est impossible d'\u00E9valuer le type '" + this.nom + "'");
    }

    @Override
    public String toString() {
        return "Type{" +
                "nom=" + nom +
                '}';
    }
}
