package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASErreur;
import interpreteur.as.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.BinOp;
import interpreteur.ast.buildingBlocs.expressions.CreerListe;
import interpreteur.ast.buildingBlocs.expressions.ValeurConstante;
import interpreteur.ast.buildingBlocs.expressions.Var;

import javax.lang.model.type.NullType;

public class Assigner extends Programme {
    private final Expression<?> expr;
    private final Expression<?> valeur;
    private final boolean constante;
    private final BinOp.Operation op;

    public Assigner(Expression<?> expr, Expression<?> valeur, boolean constante, BinOp.Operation op) {
        if (! (expr instanceof Var || expr instanceof CreerListe.SousSection)) {
            throw new ASErreur.ErreurSyntaxe("");
        }
        this.expr = expr;
        this.valeur = valeur;
        if (constante && op != null) {
            throw new ASErreur.ErreurAssignement("Il est impossible de modifier la valeur d'une variable constante");
        }
        this.constante = constante;
        this.op = op;
    }

    @Override
    public NullType execute() {
        Var varExpr;
        ASObjet.Variable var;
        ASObjet<?> valeur = this.valeur.eval();

        if (expr instanceof Var) {
            varExpr = (Var) expr;
            var = ASObjet.VariableManager.obtenirVariable(varExpr.getNom());
            if (constante) {
                if (var == null){
                    ASObjet.VariableManager.ajouterConstante(new ASObjet.Constante(varExpr.getNom(), valeur));
                    return null;
                } else {
                    throw new ASErreur.ErreurAssignement("La variable '" + varExpr.getNom() + "' a d\u00E9j\u00E0 \u00E9t\u00E9 d\u00E9clar\u00E9");
                }
            }

        } else if (expr instanceof CreerListe.SousSection) {
            /*
            TODO message d'erreur si getExpr() retourne autre chose qu'une Var
            */
            varExpr = (Var) ((CreerListe.SousSection) expr).getExpr();
            var = ASObjet.VariableManager.obtenirVariable(varExpr.getNom());
            if (var == null || ASObjet.VariableManager.estConstante(var)) {
                /*
                TODO message d'erreur assignement invalide
                */
                throw new ASErreur.ErreurAssignement("impossible d'assigner ...");
            }
            ASObjet.Liste listeInitial = (ASObjet.Liste) var.obtenirValeur();

            if (expr instanceof CreerListe.SousSection.CreerSousSection) {
                if (!(valeur instanceof ASObjet.Liste)) {
                    /*
                    TODO ERREUR peut pas assigner une sous liste à autre chose qu'à une liste
                     */
                    throw new ASErreur.ErreurAssignement("impossible d'assigner ...");
                }
                int fin = ((CreerListe.SousSection.CreerSousSection) expr).getFin();
                int debut = ((CreerListe.SousSection.CreerSousSection) expr).getDebut();
                valeur = listeInitial.remplacerRange(debut, fin, (ASObjet.Liste) valeur);

            } else if (expr instanceof CreerListe.SousSection.IndexSection) {
                int idx = ((CreerListe.SousSection.IndexSection) expr).getIdx();
                if (op != null) {
                    valeur = op.apply(expr, new ValeurConstante(valeur));
                }
                valeur = listeInitial.remplacer(idx, valeur);
                var.changerValeur(valeur);
                return null;
            }

        } else {
            /*
            TODO message d'erreur assignement invalide
             */
            throw new ASErreur.ErreurAssignement("impossible d'assigner ...");
        }
        if (var == null && op != null) {
            throw new ASErreur.ErreurAssignement("La variable '" + varExpr.getNom() + "' n'a pas \u00E8t\u00E8 d\u00E8clar\u00E8");
        }
        if (var != null) {
            if (ASObjet.VariableManager.estConstante(var))
                throw new ASErreur.ErreurAssignement("Il est impossible de changer la valeur d'une constante");
            if (op != null) {
                valeur = op.apply(varExpr, new ValeurConstante(valeur));
            }
            var.changerValeur(valeur);
        } else {
            ASObjet.VariableManager.ajouterVariable(new ASObjet.Variable(varExpr.getNom(), valeur, false));
        }

        return null;
    }

    @Override
    public String toString() {
        return "Assigner{" +
                "expr=" + expr +
                ", valeur=" + valeur +
                ", constante=" + constante +
                '}';
    }
}
