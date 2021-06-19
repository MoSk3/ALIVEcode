package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.ASErreur;
import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

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

    /**
     * @return la valeur dans le Nom
     */
    @Override
    public ASObjet<?> eval() {
        try {
            return ASObjet.VariableManager.obtenirVariable(this.nom).obtenirValeur();
        } catch (ASErreur.ErreurAliveScript | ASErreur.Stop err) {
            throw err;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ASErreur.ErreurVariableInconnue("Variable '" + this.nom + "' inconnue");
        }
    }
}
