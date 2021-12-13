package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.objets.ASObjet;
import interpreteur.as.objets.Parametre;
import interpreteur.ast.buildingBlocs.Expression;

public class Argument implements Expression<Parametre> {
    private final Var var;
    private final ASObjet<?> valeurParDefaut;
    private final Type type;

    public Argument(Var var, Expression<?> valeurParDefaut, Type type) {
        this.var = var;
        this.type = type;
        try {
            this.valeurParDefaut = valeurParDefaut == null ? null : valeurParDefaut.eval();
        } catch (ASErreur.ErreurVariableInconnue e) {
            throw new ASErreur.ErreurVariableInconnue("Impossible d'utiliser une variable comme valeur par défaut d'une fonction");
        }
        if (this.type != null && this.valeurParDefaut != null && this.type.noMatch(this.valeurParDefaut.obtenirNomType())) {
            throw new ASErreur.ErreurType("Le parametre '" + var.getNom() + "' est de type '" + type.nom() +
                    "', mais la valeur par d\u00E9faut est de type '" + this.valeurParDefaut.obtenirNomType() + "'.");
        }
    }


    @Override
    public Parametre eval() {
        return new Parametre(type, var.getNom(), valeurParDefaut);
    }

    @Override
    public String toString() {
        return "Argument{" +
                "nom=" + var +
                ", valeurParDefaut?=" + valeurParDefaut +
                ", type?=" + type +
                '}';
    }
}
