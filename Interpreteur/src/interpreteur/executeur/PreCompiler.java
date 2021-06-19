package interpreteur.executeur;

import java.util.stream.Stream;

public class PreCompiler {
    public final static String COMMENTAIRE = "#";
    public final static String MULTI_LIGNE_DEBUT = "(:";
    public final static String MULTI_LIGNE_FIN = ":)";

    public final static String DOCUMENTATION_DEBUT = "(-:";
    public final static String DOCUMENTATION_FIN = ":-)";


    public static String[] preCompile(String[] lignes, String msgFin) {
        String lignesFinales = "";
        boolean multiligne = false;
        boolean documentation = false;
        lignes = Stream.of(lignes).map(
                ligne -> ligne.endsWith("\n") ?
                        ligne.substring(0, ligne.length() - 1).trim()
                        :
                        ligne.trim()
        ).toArray(String[]::new);

        for (String s : lignes) {
            String ligne = s;

            if (multiligne) {
                if (ligne.contains(MULTI_LIGNE_FIN)) {
                    multiligne = false;
                    ligne = ligne.substring(ligne.indexOf(MULTI_LIGNE_FIN) + MULTI_LIGNE_FIN.length()).trim();
                } else continue;
            }
            if (documentation) {
                if (ligne.contains(DOCUMENTATION_FIN)) {
                    documentation = false;
                    ligne = ligne.substring(ligne.indexOf(DOCUMENTATION_FIN) + DOCUMENTATION_FIN.length()).trim();
                } else continue;
            }
            if (ligne.contains(COMMENTAIRE)) {
                ligne = ligne.substring(0, ligne.indexOf(COMMENTAIRE)).trim();
            }
            if (ligne.contains(MULTI_LIGNE_DEBUT)) {
                ligne = ligne.substring(0, ligne.indexOf(MULTI_LIGNE_DEBUT)).trim();
                multiligne = true;
            }
            if (ligne.contains(DOCUMENTATION_DEBUT)) {
                ligne = ligne.substring(0, ligne.indexOf(DOCUMENTATION_DEBUT)).trim();
                documentation = true;
            }
            ligne = ligne.endsWith("\\") ? ligne.substring(0, ligne.indexOf("\\")) : ligne + "\n";
            lignesFinales += ligne;
        }
        lignesFinales += msgFin;
        return Stream.of(lignesFinales.split("\n"))
                .map(ligne -> ligne.trim() + "\n")
                .toArray(String[]::new);
    }
}
