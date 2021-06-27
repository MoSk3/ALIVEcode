package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.Scope;
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
        this.addSetter();
    }

    public Var getVar() {
        return var;
    }

    public void addSetter() {
        ASObjet.Variable v =  Scope.getCurrentScope().getVariable(var.getNom());

        if (v == null) {
            Declarer.addWaitingSetter(this);
            return;
        }

        v.setSetter((valeur) -> {
            ASObjet.Fonction set = new ASObjet.Fonction(this.var.getNom(), new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(this.type, this.nomArg.getNom(), null)
            }, this.type);
            set.setScopeName("set_");
            return set.setParamPuisExecute(new ArrayList<>(Collections.singletonList(valeur)));
        });
    }

    @Override
    public Object execute() {
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(Executeur.nouveauScope("set_" +
                (ASObjet.FonctionManager.obtenirStructure().isBlank() ? "" : ASObjet.FonctionManager.obtenirStructure() + ".") + ligne.get(1).obtenirValeur()));
    }
}
