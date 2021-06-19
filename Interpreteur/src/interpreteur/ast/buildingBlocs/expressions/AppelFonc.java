package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public class AppelFonc implements Expression<ASObjet<?>> {

    private final Expression<?> var;
    private final CreerListe args;

    public AppelFonc(Expression<?> var, CreerListe args) {
        this.var = var;
        this.args = args;
    }

    @Override
    public ASObjet<?> eval() {
        ASObjet<?> result = var.eval();
        if (!(result instanceof ASObjet.Fonction)) {
            throw new ASErreur.ErreurAppelFonction("Un \u00E9l\u00E9ment de type '" + result.obtenirNomType() + "' ne peut pas être appel\u00E9");
        }
        return ((ASObjet.Fonction) result).setParamPuisExecute(args.eval().getValue());
    }

    @Override
    public String toString() {
        return "AppelFonc{" +
                "nom=" + var +
                ", args=" + args +
                '}';
    }
}
