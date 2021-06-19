package interpreteur.executeur;

import java.util.stream.Stream;

public class PreCompiler {
    public final static String COMMENTAIRE = "#";
    public final static String MULTI_LIGNE_COMMENTAIRE = "";

    public static String[] formaterLignes(String[] lignes) {
        String lignesFinales = "";

        lignes = Stream.of(lignes).map(
                ligne -> ligne.endsWith("\n") ?
                        ligne.substring(0, ligne.length() - 1).trim()
                        :
                        ligne.trim()
        ).toArray(String[]::new);

        for (String s : lignes) {
            String ligne = s;
            if (ligne.contains(COMMENTAIRE)) {
                ligne = ligne.substring(0, ligne.indexOf(COMMENTAIRE));
                ligne = ligne.trim();
            }
            ligne = ligne.endsWith("\\") ? ligne.substring(0, ligne.indexOf("\\")) : ligne + "\n";
            lignesFinales += ligne;
        }

        return Stream.of(lignesFinales.split("\n"))
                .map(ligne -> ligne.trim() + "\n")
                .toArray(String[]::new);
    }
}
