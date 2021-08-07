package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASFonction;
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
        ASObjet<?> fonction = var.eval();
        if (!(fonction instanceof ASFonction || fonction instanceof ASObjet.Fonction)) {
            throw new ASErreur.ErreurAppelFonction("Un \u00E9l\u00E9ment de type '" + fonction.obtenirNomType() + "' ne peut pas \u00EAtre appel\u00E9");
        }
        if (fonction instanceof ASFonction) {
            return ((ASFonction) fonction).makeInstance().executer(args.eval().getValue());
        } else {
            return ((ASObjet.Fonction) fonction).setParamPuisExecute(args.eval().getValue());
        }
    }

    @Override
    public String toString() {
        return "AppelFonc{" +
                "nom=" + var +
                ", args=" + args +
                '}';
    }
}
