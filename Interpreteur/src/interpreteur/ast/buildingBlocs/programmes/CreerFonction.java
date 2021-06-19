package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.ASObjet;
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

    private final Var var;
    private final List<Argument> args;
    private final Type typeRetour;

    public CreerFonction(Var var, Argument[] args, Type typeRetour) {
        this.var = var;
        this.args = Arrays.asList(args);
        this.typeRetour = typeRetour;
    }


    @Override
    public NullType execute() {
        ASObjet.FonctionManager.ajouterFonction(
                new ASObjet.Fonction(var.getNom(), args.stream().map(Argument::eval).toArray(ASObjet.Fonction.Parametre[]::new), typeRetour == null ? null : typeRetour.getNom())
        );
        return null;
    }

    @Override
    public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
        return new Coordonnee(Executeur.nouveauScope("fonc_" +
                (ASObjet.FonctionManager.obtenirStructure().isBlank() ? "" : ASObjet.FonctionManager.obtenirStructure() + ".") + ligne.get(1).obtenirValeur()));
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
