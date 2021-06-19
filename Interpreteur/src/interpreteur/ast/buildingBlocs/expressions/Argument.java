package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public class Argument implements Expression<ASObjet.Fonction.Parametre> {
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
        if (this.type != null && this.valeurParDefaut != null && !this.valeurParDefaut.obtenirNomType().equals(this.type.getNom())) {
            throw new ASErreur.ErreurType("Le parametre '" + var.getNom() + "' est de type '" + type.getNom() +
                    "', mais la valeur par d\u00E9faut est de type '" + this.valeurParDefaut.obtenirNomType() + "'.");
        }
    }


    @Override
    public ASObjet.Fonction.Parametre eval() {
        return new ASObjet.Fonction.Parametre(type, var.getNom(), valeurParDefaut);
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
