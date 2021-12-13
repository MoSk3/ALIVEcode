package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.objets.datatype.ASFonction;
import interpreteur.as.objets.Scope;
import interpreteur.as.objets.Variable;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import java.util.ArrayList;
import java.util.List;

public class CreerGetter extends Programme {
    private final Var var;
    private final Type type;
    private final Scope scope;

    public CreerGetter(Var var, Type type, Executeur executeurInstance) {
        super(executeurInstance);
        this.var = var;
        this.type = type;
        this.addGetter();
        this.scope = Scope.makeNewCurrentScope();
    }

    public Var getVar() {
        return var;
    }

    public void addGetter() {
        Variable v = Scope.getCurrentScope().getVariable(var.getNom());

        if (v == null) {
            Declarer.addWaitingGetter(this);
            return;
        }

        v.setGetter(() -> {
            Scope scope = new Scope(this.scope);
            scope.setParent(Scope.getCurrentScopeInstance());

            ASFonction get = new ASFonction(this.var.getNom(), this.type, executeurInstance);
            get.setScope(scope);
            get.setCoordBlocName("get_");
            return get.makeInstance().executer(new ArrayList<>());
        });
    }

    @Override
    public Object execute() {
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(executeurInstance.nouveauScope("get_" + ligne.get(1).obtenirValeur()));
    }

    @Override
    public String toString() {
        return "CreerGetter{" +
                "var=" + var +
                "type?=" + type +
                '}';
    }
}
