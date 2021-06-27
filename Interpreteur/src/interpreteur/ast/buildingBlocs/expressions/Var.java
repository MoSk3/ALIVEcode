package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.Scope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.executeur.Executeur;

import java.util.Objects;

public class Var implements Expression<ASObjet<?>> {
    private final String nom;

    public Var(String nom) {
        this.nom = nom;
    }


    public String getNom() {
        return nom;
    }

    @Override
    public String toString() {
        return "Var{" +
                "nom='" + nom + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Var)) return false;
        Var var = (Var) o;
        return nom.equals(var.nom);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nom);
    }

    /**
     * @return la valeur dans le Nom
     */
    @Override
    public ASObjet<?> eval() {
        try {
            // return ASObjet.VariableManager.obtenirVariable(this.nom).getValeurApresGetter();
            return Scope.getCurrentScopeInstance().getVariable(nom).getValeurApresGetter();
        } catch (NullPointerException e) {
            throw new ASErreur.ErreurVariableInconnue("Variable '" + this.nom + "' inconnue");
        }
    }
}
