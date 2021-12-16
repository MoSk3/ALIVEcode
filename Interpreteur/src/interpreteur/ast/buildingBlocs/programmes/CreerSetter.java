package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.*;
import interpreteur.as.lang.datatype.ASFonction;
import interpreteur.as.lang.managers.FonctionManager;
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
    private final Scope scope;

    public CreerSetter(Var var, Var nomArg, Type type, Executeur executeurInstance) {
        super(executeurInstance);
        this.var = var;
        this.nomArg = nomArg;
        this.type = type;
        this.addSetter();
        this.scope = Scope.makeNewCurrentScope();
    }

    public Var getVar() {
        return var;
    }

    public void addSetter() {
        ASVariable v =  Scope.getCurrentScope().getVariable(var.getNom());

        if (v == null) {
            Declarer.addWaitingSetter(this);
            return;
        }

        v.setSetter((valeur) -> {
            Scope scope = new Scope(this.scope);
            scope.setParent(Scope.getCurrentScopeInstance());

            ASFonction set = new ASFonction(this.var.getNom(), new ASParametre[]{
                    new ASParametre(this.type, this.nomArg.getNom(), null)
            }, this.type, executeurInstance);

            scope.declarerVariable(new ASVariable(this.nomArg.getNom(), null, this.type));

            set.setScope(scope);
            set.setCoordBlocName("set_");

            return set.makeInstance().executer(new ArrayList<>(Collections.singletonList(valeur)));
        });
    }

    @Override
    public Object execute() {
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(executeurInstance.nouveauScope("set_" +
                (FonctionManager.obtenirStructure().isBlank() ? "" : FonctionManager.obtenirStructure() + ".") + ligne.get(1).obtenirValeur()));
    }
}
