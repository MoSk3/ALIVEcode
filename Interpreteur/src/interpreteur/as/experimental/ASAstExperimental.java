package interpreteur.as.experimental;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import interpreteur.as.ASAst;
import interpreteur.as.erreurs.ASErreur.*;
import interpreteur.as.Objets.ASObjet.Booleen;
import interpreteur.as.Objets.ASObjet.Decimal;
import interpreteur.as.Objets.ASObjet.Entier;
import interpreteur.as.Objets.ASObjet.FonctionManager;
import interpreteur.as.Objets.ASObjet.Nul;
import interpreteur.as.Objets.ASObjet.Texte;
import interpreteur.ast.Ast;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Argument;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.expressions.*;
import interpreteur.ast.buildingBlocs.programmes.*;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.generateurs.ast.AstGenerator;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;


/**
 * Les explications vont être rajouté quand j'aurai la motivation de les écrire XD
 *
 * @author Mathis Laroche
 */


public class ASAstExperimental extends ASAst {
    public ASAstExperimental(Executeur executeurInstance) {
        super(executeurInstance);
        ajouterProgrammes();
        ajouterExpressions();
    }



}

























