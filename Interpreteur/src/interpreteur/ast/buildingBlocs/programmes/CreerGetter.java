package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CreerGetter extends Programme {
    private final Var var;
    private final Type type;

    public CreerGetter(Var var, Type type) {
        this.var = var;
        this.type = type;
    }

    @Override
    public Object execute() {
        ASObjet.Variable v = ASObjet.VariableManager.obtenirVariable(this.var.getNom());

        if (v == null) {
            v = new ASObjet.Variable(this.var.getNom(), null,false);
            ASObjet.VariableManager.ajouterVariable(v);
        }

        v.setGetter((var) -> {
            ASObjet.Fonction get = new ASObjet.Fonction(this.var.getNom(), new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(null, this.var.getNom(), null)
            }, this.type == null ? null : this.type.getNom());
            get.setScopeName("get_");
            return get.setParamPuisExecute(new ArrayList<>(Collections.singletonList(var)));
        });
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(Executeur.nouveauScope("get_" + ligne.get(1).obtenirValeur()));
    }

    @Override
    public String toString() {
        return "CreerGetter{" +
                "var=" + var +
                "type?=" + type +
                '}';
    }
}
