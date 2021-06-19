package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASErreur;
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

public class CreerSetter extends Programme {
    private final Var var;
    private final Var nomArg;
    private final Type type;

    public CreerSetter(Var var, Var nomArg, Type type) {
        this.var = var;
        this.nomArg = nomArg;
        this.type = type;
    }

    @Override
    public Object execute() {
        ASObjet.Variable v = ASObjet.VariableManager.obtenirVariable(this.var.getNom());

        if (v == null) {
            v = new ASObjet.Variable(this.var.getNom(), null,false);
            ASObjet.VariableManager.ajouterVariable(v);
        }

        if (ASObjet.VariableManager.estConstante(v)){
            throw new ASErreur.ErreurAssignement("Il est impossible de d\u00E9finir un setter pour une constante");
        }

        v.setSetter((valeur) -> {
            ASObjet.Fonction set = new ASObjet.Fonction(this.var.getNom(), new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(this.type == null ? null : this.type.getNom(), this.nomArg.getNom(), null)
            }, null);
            set.setScopeName("set_");
            return set.setParamPuisExecute(new ArrayList<>(Collections.singletonList(valeur)));
        });
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(Executeur.nouveauScope("set_" +
                (ASObjet.FonctionManager.obtenirStructure().isBlank() ? "" : ASObjet.FonctionManager.obtenirStructure() + ".") + ligne.get(1).obtenirValeur()));
    }
}
