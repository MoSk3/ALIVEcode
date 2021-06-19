package interpreteur.as;

import java.io.File;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

import interpreteur.generateurs.lexer.LexerGenerator;
import interpreteur.tokens.Token;



/**
 * 
 * Les explications vont être rajouté quand j'aurai la motivation de les écrire XD
 * @author Mathis Laroche
 */ 
public class ASLexer extends LexerGenerator {
	// keywords en francais
	private final static String FICHIER_FR = "src/interpreteur/regle_et_grammaire/ASgrammaireFR.txt";
	
	// keywords en anglais
	private final static String FICHIER_EN = "src/interpreteur/regle_et_grammaire/ASgrammaireEN.txt";
	
	File configGrammaire = new File(FICHIER_FR);
	
	public ASLexer() {
        setRegles(configGrammaire);
        sortRegle();
        //this.getReglesAjoutees().forEach(e -> System.out.println(e.getNom()));
    }
	
    public ASLexer(File configGrammaire) throws FileNotFoundException {
        setRegles(configGrammaire);
        sortRegle();
        //this.getReglesAjoutees().forEach(e -> System.out.println(e.getNom()));
    }

    private void setRegles(File configGrammaire){
        chargerRegles(configGrammaire);
    }
    

    public static void afficherLexLigne(List<Object> ligne) {
    	ligne.forEach(e -> System.out.print(e instanceof Token ? ((Token) e).obtenirNom() + ": [" + ((Token) e).obtenirValeur() + "]; " : e + " "));
		System.out.println();
	}
    
    public static List<String> nomLex(List<Object> ligne) {
    	return ligne.stream().map(token -> ((Token) token).obtenirNom()).collect(Collectors.toList());
    }


    public LexerGenerator build(){
        return (LexerGenerator) this;
    }

}
