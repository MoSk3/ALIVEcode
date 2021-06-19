package interpreteur.generateurs.styler;

import java.awt.Color;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Hashtable;
import java.util.Scanner;

import javax.swing.text.Style;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;

import interpreteur.tokens.Token;

/**
 * 
 * @author Mathis Laroche
 *
 */

/**
 * 
 * Les explications vont �tre rajout� quand j'aurai la motivation de les �crire XD
 *
 */

public class StyleGenerator {
	private StyledDocument doc;

	private File configGrammaire = new File("src/interpreteur/regle_et_grammaire/styles.txt");

	Hashtable<String, Style> styleListe = new Hashtable<>();
	// la liste des noms des styles ajout�s
	
	public Style styleParDefaut;

	public StyleGenerator(StyledDocument doc){
		this.doc = doc;
		this.chargerStyles(configGrammaire);
	}


	private void chargerStyles(File configGrammaire){
		try {
			Scanner grammaire = new Scanner(configGrammaire);

			String section = "";
			Hashtable<String, String> params = new Hashtable<>();
			boolean commentaire = false;

			while (grammaire.hasNextLine()) {
				String line = grammaire.nextLine().trim();

				if (line.startsWith("\"\"\"")) {
					commentaire = ! commentaire;
				}

				if (commentaire || line.isBlank() || line.startsWith("#")) {
					continue;
				} else {
					if (line.endsWith("{")) {
						section = line.substring(0, line.length() - 1).trim();
						continue;
					}
					if (line.equals("}")) {
						ajouterStyle(params, section);

						section = "";
						params = new Hashtable<>();
						continue;
					}
					if (! section.isEmpty()) {
						String nom = line.split(":")[0].trim();
						String valeur = line.split(":")[1].trim();
						params.put(nom, valeur);
					}
				}
			}
			this.styleParDefaut = this.styleListe.get("(defaut)");
			grammaire.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}

	private void ajouterStyle(Hashtable<String, String> styleParams, String noms) {
		for (String nom : noms.split("\\|")) {
			nom = nom.trim().toLowerCase();
			Style style = this.doc.addStyle(nom, null);
			this.styleListe.put(nom, style);
			
			if (! nom.equals("(defaut)")) {
				style.setResolveParent(this.styleListe.get("(defaut)").copyAttributes());
			}
			
			for (String param : styleParams.keySet()) {
				String valeur = styleParams.get(param).replaceAll(" ", "");
				switch (param) {
				case "couleur":
					String[] nombres = valeur.split(",");
					int[] RGB = {
							Integer.parseInt(nombres[0]),
							Integer.parseInt(nombres[1]),
							Integer.parseInt(nombres[2])};
					StyleConstants.setForeground(style, new Color(RGB[0], RGB[1], RGB[2]));
					break;
				case "italique": 
					StyleConstants.setItalic(style, Boolean.parseBoolean(valeur));
					break;
				case "gras":
					StyleConstants.setBold(style, Boolean.parseBoolean(valeur));
					break;
				case "souligner":
					StyleConstants.setUnderline(style, Boolean.parseBoolean(valeur));
					break;
				case "taille":
					StyleConstants.setFontSize(style, Integer.parseInt(valeur));
					break;
				case "fontFamily":
					StyleConstants.setFontFamily(style, valeur);
					break;
				}
			}
		}
	}


	public void overwriteStyleToken(Token token, int offset, String nomDuStyle) {
		this.doc.setCharacterAttributes(offset + token.obtenirDebut(), 
				token.obtenirValeur().length(), 
				this.styleListe.get(nomDuStyle),
				true);

	}
	
	


	public boolean appliquerStyleToken(Token token, int offset) {
		/**
		 * @return true si le style existe et a ete applique, false sinon
		 */
		if (! this.styleListe.containsKey(token.obtenirNom().toLowerCase())) {
			return false;
		}
		this.doc.setCharacterAttributes(offset + token.obtenirDebut(), 
				token.obtenirValeur().length(),
				this.styleListe.get(token.obtenirNom().toLowerCase()),
				true);
		return true;
	}

	public boolean appliquerStyleCategorie(Token token, int offset) {
		/**
		 * @return true si le style existe et a ete applique, false sinon
		 */
		if (! this.styleListe.containsKey("." + token.obtenirCategorie().toLowerCase())) {
			return false;
		}
		this.doc.setCharacterAttributes(offset + token.obtenirDebut(), 
				token.obtenirValeur().length(), 
				this.styleListe.get("." + token.obtenirCategorie().toLowerCase()),
				true);
		return true;
	}

	public void appliquerStyleParDefautToken(Token token, int offset) {
		this.doc.setCharacterAttributes(offset + token.obtenirDebut(), 
				token.obtenirValeur().length(), 
				this.styleListe.get("(defaut)"),
				true);	
	}
	
	public void appliquerStyleErreurToken(Token token, int offset) {
		this.doc.setCharacterAttributes(offset + token.obtenirDebut(), 
				token.obtenirValeur().length(), 
				this.styleListe.get("(erreur)"),
				true);

	}
	
	
	public void resetStyleLigne(String ligne, int debut) {
		this.doc.setCharacterAttributes(debut, 
				ligne.length(), 
				this.styleListe.get("(defaut)"),
				true);	
	}
}




























