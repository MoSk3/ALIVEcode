package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.lang.*;
import interpreteur.as.lang.datatype.ASFonction;
import interpreteur.as.lang.managers.FonctionManager;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Argument;
import interpreteur.ast.buildingBlocs.expressions.Var;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.Arrays;
import java.util.List;


public class CreerFonction extends Programme {
    private final Scope scope;
    private final Var var;
    private final List<Argument> args;
    private final Type typeRetour;

    public CreerFonction(Var var, Argument[] args, Type typeRetour, Executeur executeurInstance) {
        super(executeurInstance);
        this.var = var;
        this.args = Arrays.asList(args);
        this.typeRetour = typeRetour;
        // declare fonction
        Scope.getCurrentScope().declarerVariable(new Variable(var.getNom(), null, new Type("fonctionType")));
        this.scope = Scope.makeNewCurrentScope();
    }

    @Override
    public NullType execute() {
        Scope scope = new Scope(this.scope);
        ASFonction fonction = new ASFonction(var.getNom(), this.args.stream().map(Argument::eval).toArray(Parametre[]::new), this.typeRetour, executeurInstance);

        Scope.getCurrentScopeInstance().getVariable(fonction.getNom()).changerValeur(fonction);
        // declare fonction
        // Scope.getCurrentScope().declarerVariable(new ASObjet.Variable(fonction.getNom(), fonction, new Type(fonction.obtenirNomType())));

        // declare params
        for (Argument arg : this.args) {
            Parametre param = arg.eval();
            scope.declarerVariable(new Variable(param.getNom(), param.getValeurParDefaut(), param.getType()));
            //ASObjet.VariableManager.ajouterVariable(new ASObjet.Variable(param.getNom(), param.getValeurParDefaut(), param.getType()), scopeName);
        }

        fonction.setScope(scope);
        scope.setParent(Scope.getCurrentScopeInstance());

        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(executeurInstance.nouveauScope("fonc_" + FonctionManager.ajouterDansStructure(this.var.getNom())));
    }

    @Override
    public String toString() {
        return "CreerFonction{" +
                "nom=" + var +
                ", args=" + args +
                ", typeRetour?=" + typeRetour +
                '}';
    }
}
