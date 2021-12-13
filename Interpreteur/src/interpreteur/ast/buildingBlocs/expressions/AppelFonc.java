package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.objets.FonctionModule;
import interpreteur.as.objets.datatype.ASFonction;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;

public record AppelFonc(Expression<?> var,
                        CreerListe args) implements Expression<ASObjet<?>> {

    @Override
    public ASObjet<?> eval() {
        ASObjet<?> fonction = var.eval();
        if (!(fonction instanceof ASFonction || fonction instanceof FonctionModule)) {
            throw new ASErreur.ErreurAppelFonction("Un \u00E9l\u00E9ment de type '" + fonction.obtenirNomType() + "' ne peut pas \u00EAtre appel\u00E9");
        }
        if (fonction instanceof ASFonction f) {
            return f.makeInstance().executer(args.eval().getValue());
        } else {
            return ((FonctionModule) fonction).setParamPuisExecute(args.eval().getValue());
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
