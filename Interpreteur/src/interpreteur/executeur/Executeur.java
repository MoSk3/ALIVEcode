package interpreteur.executeur;

import java.time.LocalDateTime;
import java.util.*;

import interpreteur.as.Objets.ASObjet.FonctionManager;
import interpreteur.as.Objets.Scope;
import interpreteur.as.erreurs.ASErreur.*;
import interpreteur.as.ASLexer;
import interpreteur.as.modules.ASModule;
import interpreteur.as.ASAst;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.programmes.Declarer;
import interpreteur.data_manager.Data;
import interpreteur.data_manager.DataVoiture;
import interpreteur.tokens.Token;



/*

afficher 3

attendre 2

var = 2

si var == 2
	avancer
sinon
	afficher faux
fin si

afficher "fin"

*/


/**
 * Cette classe
 *
 * @author Mathis Laroche
 */

public class Executeur {
    // coordonne ou commencer tous les programmes
    final private static Coordonnee debutCoord = new Coordonnee("<0>main");

    //------------------------ compilation -----------------------------//

    private static final ArrayList<Coordonnee> coordCompileTime = new ArrayList<>();

    private static final Hashtable<String, Hashtable<String, Programme>> coordCompileDict = new Hashtable<>();
    /*
     * forme:
     * {
     * 		"scope1": {
     * 				 	{programme, arbre, programmeToken}, // ligne 1 du scope 1
     * 					{programme, arbre, programmeToken}, // ligne 2 du scope 1
     * 					...
     * 				  },
     * 		"scope2": {
     * 					{programme, arbre, programmeToken}, // ligne 1 du scope 2
     * 					{programme, arbre, programmeToken}, // ligne 2 du scope 2
     * 					...
     * 				  },
     * 		...
     *
     * }
     */

    // Coordonnee utilisee lors de l'execution pour savoir quelle ligne executer
    final private static Coordonnee coordRunTime = new Coordonnee(debutCoord.getCoordAsString());
    final private static ArrayList<Data> datas = new ArrayList<>();
    private static String[] anciennesLignes = null;
    // lexer et parser
    private static ASLexer lexer = new ASLexer();
    private static ASAst ast = new ASAst();

    // failsafe
    private static boolean compilationActive = false;
    private static boolean executionActive = false;
    private static boolean canExecute = false;

    //debug mode
    private static boolean debug = false;


    public Executeur() {
    }

    public Executeur(ASLexer lexer) {
        Executeur.lexer = lexer;
    }

    // methode utilisee a chaque fois qu'une info doit etre afficher par le langage
    public static void ecrire(String texte) {
        if (debug) System.out.println(texte);
    }

    public static void printCompiledCode(String code) {
        int nbTab = 0;
        code = code.replaceAll(", ", ",");

        boolean inString = false;
        boolean skipNext = false;
        for (String chr : code.split("")) {
            if (inString) {
                System.out.print(chr);
                if (chr.equals("\\")) {
                    skipNext = true;
                    continue;
                }
                inString = !chr.equals("'") || skipNext;
                skipNext = false;
                continue;
            }
            switch (chr) {
                case "{", "[" -> {
                    nbTab++;
                    System.out.print(" " + chr + "\n" + "\t".repeat(nbTab));
                }
                case "}", "]" -> {
                    nbTab--;
                    System.out.print("\n" + "\t".repeat(nbTab) + chr);
                }
                case "," -> System.out.print(chr + "\n" + "\t".repeat(nbTab));
                case "'" -> {
                    System.out.print(chr);
                    inString = true;
                }
                default -> System.out.print(chr);
            }
        }
        System.out.println();
    }

    public static void printCompileDict() {
        int nbTab = 0;
        for (String scope : coordCompileDict.keySet()) {
            System.out.print("\n" + scope + ":\n");
            String[] ordreCoord = coordCompileDict.get(scope).keySet()
                    .stream()
                    .sorted(Comparator.comparingInt(coord -> coordCompileDict.get(scope).get(coord).getNumLigne()))
                    .toArray(String[]::new);

            for (String coord : ordreCoord) {
                String prog = coordCompileDict.get(scope).getOrDefault(coord,
                        new Programme() {
                            @Override
                            public Object execute() {
                                return null;
                            }
                        }
                ).toString();
                System.out.print("\t".repeat(nbTab) + coord + "=");
                printCompiledCode(prog);
            }
        }
    }

    public static void addData(Data data) {
        datas.add(data);
    }

    /**
     * @return le lexer utilise par l'interpreteur (voir ASLexer)
     */
    public static ASLexer getLexer() {
        return Executeur.lexer;
    }

    /**
     * @return le parser utilise par l'interpreteur (voir ASAst)
     */
    public static ASAst getAst() {
        return Executeur.ast;
    }

    public static void setAst(ASAst ast) {
        Executeur.ast = ast;
    }

    /**
     * @return les dernieres lignes a avoir ete compile sous la forme d'une array de String
     */
    public static String[] getLignes() {
        return anciennesLignes;
    }

    /**
     * @param nomDuScope <li>cree un nouveau scope et ajoute la premiere coordonnee a ce scope</li>
     * @return la premiere coordonnee du scope
     */
    public static String nouveauScope(String nomDuScope) {
        coordCompileDict.put(nomDuScope, new Hashtable<>());
        // peut-etre faire en sorte qu'il y ait une erreur si le scope existe deja
        coordCompileTime.add(new Coordonnee("<0>" + nomDuScope));
        coordCompileDict.get(nomDuScope).put("<0>" + nomDuScope, new Programme() {
            @Override
            public Object execute() {
                return null;
            }

            @Override
            public String toString() {
                return "DEBUT FONCTION: '" + nomDuScope + "'";
            }
        });
        return "<0>" + nomDuScope;
    }

    /**
     * met fin au scope actuel et retourne dans le scope precedent
     *
     * @return la nouvelle coordonne actuelle
     */
    public static String finScope() {
        if (coordCompileTime.size() == 1) {
            throw new ErreurFermeture("main", "");
        }
        coordCompileTime.remove(coordCompileTime.size() - 1);
        return coordCompileTime.get(coordCompileTime.size() - 1).getCoordAsString();
    }

    /**
     * @return la coordonne actuelle lors de l'execution du code
     */
    public static Coordonnee obtenirCoordRunTime() {
        return coordRunTime;
    }

    /**
     * @param coord <li>la coordonne d'une certaine ligne de code</li>
     * @return la position de la la ligne de code dans le code
     */
    public static Integer getLineFromCoord(Coordonnee coord) {
        return coordCompileDict.get(coord.getScope()).get(coord.getCoordAsString()).getNumLigne();
    }

    /**
     * permet de changer la coordonne lors de l'execution du code
     *
     * @param coord <li>la nouvelle coordonnee</li>
     */
    public static void setCoordRunTime(String coord) {
        Executeur.coordRunTime.setCoord(coord);
    }

    /**
     * @return le dictionnaire de coordonnees compilees
     */
    public static Hashtable<String, Hashtable<String, Programme>> obtenirCoordCompileDict() {
        return coordCompileDict;
    }

    /**
     * @param nom
     * @return
     */
    public static boolean leBlocExiste(String nom) {
        return coordCompileDict.get(coordRunTime.getScope()).containsKey("<1>" + nom + coordRunTime.getCoordAsString());
    }


    public static boolean enAction() {
        return (compilationActive || executionActive);
    }

    public static void arreterExecution() {
        Executeur.executionActive = false;
    }


    /**
     * Cette fonction permet de compiler des lignes de code afin de pouvoir les executer (voir Executeur.executerMain)
     *
     * @param lignes            <li>
     *                          Type: String[]
     *                          </li>
     *                          <li>
     *                          Represente les lignes de code a compiler, une ligne se finit par un <code>\n</code>
     *                          </li>
     * @param compilationForcee <li>
     *                          Type: boolean
     *                          </li>
     *                          <li>
     *                          Indique si l'on souhaite forcer la compilation du code, <br>
     *                          (le code sera alors compile meme s'il est identique au code precedemment compile)
     *                          </li>
     */
    public static String compiler(String[] lignes, boolean compilationForcee) {
        reset();
        /*
         * Cette condition est remplie si l'array de lignes de codes mises en parametres est identique
         * a l'array des dernieres lignes de code compilees
         *
         * -> Elle evite donc de compiler le meme code plusieurs fois
         *
         * Cependant, cette condition peut etre overwrite si la compilation est forcee (compilationForce serait alors true)
         */
        if (Arrays.equals(lignes, anciennesLignes) && !compilationForcee) {
            System.out.println("No changes: compilation done");
            return "[]";
        } else {
            // Si le code est different ou que la compilation est forcee, compiler les lignes
            //System.out.println(Arrays.toString(PreCompiler.preCompile(lignes)));
            lignes = PreCompiler.preCompile(lignes, "\nafficher '[ex\u00E9cution termin\u00e9e]'");
            return compiler(lignes, null);
        }
    }


    /**
     * Fonction privee charge de compiler un array de ligne de code
     *
     * @param lignes <li>
     *               Type: String[]
     *               </li>
     *               <li>
     *               Represente les lignes de code a compiler, une ligne se finit par un <code>\n</code>
     *               </li>
     */
    private static String compiler(String[] lignes, Hashtable<String, Hashtable<String, Programme>> coordCompileDict) {
        if (coordCompileDict == null) {
            coordCompileDict = Executeur.coordCompileDict;
            ArrayList<Coordonnee> coordCompileTime = Executeur.coordCompileTime;
        } else {

        }

        // sert au calcul du temps qu'a pris le code pour etre compile
        LocalDateTime before = LocalDateTime.now();

        System.out.println("compiling...");

        // vide le dictionnaire de coordonne ainsi que la liste de coordonne
        coordCompileDict.clear();
        coordCompileTime.clear();

        // indique le programme est en train de compiler le code
        compilationActive = true;
        canExecute = false;

        // Hashtable representant les erreurs detectees par le linter avant la compilation (voir ASLinter.appliquerLinter)
        //Hashtable<Integer, String> erreurs = ASLinter.obtenirErreurs();
        //if (! erreurs.isEmpty()) {
        //	// pour chaque erreur detectee par le linter avant la compilation:
        //	// 		afficher l'erreur ainsi que sa position (numero de la ligne)
        //	for (Integer ligne : erreurs.keySet()) {
        //		new ErreurCompilation(erreurs.get(ligne)).afficher(ligne);
        //	}
        //	// s'assure de ne pas compiler le code s'il y a des erreurs
        //	compilationActive = false;
        //	return false;
        //}

        coordCompileTime.add(debutCoord);
        /*
         *  ajoute le scope "main" au dictionnaire de coordonnee
         *  c'est dans ce sous-dictionnaire que seront mises toutes les lignes appartenant au scope "main"
         */
        coordCompileDict.put("main", new Hashtable<>());

        // boucle a travers toutes les lignes de l'array "lignes"
        for (int i = 0; i < lignes.length; i++) {
            String line = lignes[i];

            // produit la liste de Token representant la ligne (voir lexer.lex)
            List<Token> lineToken = lexer.lex(line.trim());

            // obtiens la coordonne ainsi que le scope ou sera enregistree la ligne compilee
            String coordActuelle = coordCompileTime.get(coordCompileTime.size() - 1).getCoordAsString();
            String scopeActuel = coordCompileTime.get(coordCompileTime.size() - 1).getScope();

            // System.out.println(coordActuelle + "   " + scopeActuel);
            try {
                /*
                 * transforme la liste de Token obtenu precedemment en un Object[] de forme:
                 * Object[] {
                 * 		programme (String representant le programme de la ligne
                 * 					ex: AFFICHER expression, POUR NOM_VARIABLE DANS expression, etc.)
                 *
                 * 		arbre de syntaxe de la ligne (voir parser.parse)
                 *
                 * 		le programme sous la forme d'une liste de Token
                 * }
                 */


                Programme ligneParsed;

                if (lineToken.isEmpty()) {
                    ligneParsed = new Programme() {
                        @Override
                        public Object execute() {
                            return null;
                        }
                    };
                } else {
                    ligneParsed = ast.parse(lineToken);
                }

                ligneParsed.setNumLigne(i);

                // met ligneParsed dans le dictionnaire de coordonne
                coordCompileDict.get(scopeActuel).put(coordActuelle, ligneParsed);

                // accede a la fonction prochaineCoord du programme trouvee afin de definir la prochaine coordonnee
                coordRunTime.setCoord(ligneParsed.prochaineCoord(new Coordonnee(coordActuelle), lineToken).getCoordAsString());
                coordActuelle = coordRunTime.getCoordAsString();
                scopeActuel = coordRunTime.getScope();

                // si la coordonnee est de taille 0, cela signifie que le code contient un "fin ..." a l'exterieur d'un bloc de code
                // -> cela provoque une erreur de fermeture
                if (coordActuelle.length() == 0) {
                    throw new ErreurFermeture(scopeActuel);
                }

            } catch (ErreurAliveScript err) {
                canExecute = false;
                compilationActive = false;
                err.afficher(i + 1);
                return "[" + err.getAsData(i + 1) + "]";

            }

            // update la coordonnee
            coordCompileTime.set(coordCompileTime.size() - 1,
                    new Coordonnee(coordRunTime.plusUn().getCoordAsString())
            );

            // ajoute une ligne null à la fin pour signaler la fin de l'exécution
            if (i + 1 == lignes.length) {
                Programme fin = new Programme.ProgrammeFin();
                fin.setNumLigne(i + 1);
                coordCompileDict.get(scopeActuel).put(coordRunTime.getCoordAsString(), fin);
            }
        }
        try {
            if (!coordRunTime.getBlocActuel().equals("main")) {
                throw new ErreurFermeture(coordRunTime.getBlocActuel());
            }
            if (!FonctionManager.obtenirStructure().isBlank()) {
                throw new ErreurFermeture(FonctionManager.obtenirStructure());
            }
        } catch (ErreurAliveScript err) {
            canExecute = false;
            compilationActive = false;
            err.afficher(lignes.length);
            return "[" + err.getAsData(lignes.length) + "]";

        }

        /*
         * affiche le temps qu'a pris la compilation du programme
         */
        System.out.println("compilation done in " + (LocalDateTime.now().toLocalTime().toNanoOfDay() - before.toLocalTime().toNanoOfDay()) / Math.pow(10, 9) + " seconds\n");

        // set la valeur des anciennes lignes de code aux nouvelles lignes donnees en parametre
        anciennesLignes = lignes;
        compilationActive = false;
        canExecute = true;
        return "[]";
    }


    public static Object executerScope(String scope, Hashtable<String, Hashtable<String, Programme>> coordCompileDict, String startCoord) {
        if (coordCompileDict == null) coordCompileDict = Executeur.coordCompileDict;
        if (startCoord == null) startCoord = "<0>" + scope;

        // set la coordonne au debut du scope
        coordRunTime.setCoord(startCoord);

        Object resultat = "[]";
        Programme ligneParsed = null;

        while (executionActive && canExecute) {
            // System.out.println(coordRunTime);
            // get la ligne a executer dans le dictionnaire de coordonnees
            ligneParsed = coordCompileDict.get(scope).get(coordRunTime.getCoordAsString());

            if (ligneParsed instanceof Programme.ProgrammeFin) { // ne sera vrai que si cela est la derniere ligne du programme
                coordRunTime.setCoord(null);
                break;
            }


            // s'il y a une erreur dans l'execution, on arr�te l'execution et on �crit le message d'erreur dans la console de l'app
            try {
                // execution de la ligne et enregistrement du resultat dans la variable du meme nom
                resultat = ligneParsed.execute();

                if (resultat instanceof Data) {
                    datas.add((Data) resultat);

                } else if (resultat != null && !coordRunTime.getScope().equals("main")) {
                    // ne sera vrai que si l'on retourne d'une fonction
                    break;
                }
            } catch (StopSendData e) {
                return e.getDataString();

            } catch (StopGetInfo e) {
                datas.add(e.getData());
                return datas.toString();

            } catch (StopSetInfo e) {
                datas.add(e.getData());

            } catch (ErreurAliveScript e) {
                // si l'erreur lancee est de type ASErreur.ErreurExecution (Voir ASErreur.java),
                // on l'affiche et on arrete l'execution du programme
                datas.add(e.getAsData());
                arreterExecution();
                e.afficher();
                resultat = null;
                break;

            } catch (RuntimeException e) {
                // s'il y a une erreur, mais que ce n'est pas une erreur se trouvant dans ASErreur, c'est une
                // erreur de syntaxe, comme l'autre type d'erreur, on l'affiche et on arrete l'execution du programme
                e.printStackTrace();
                datas.add(new ErreurSyntaxe("Une erreur interne inconnue est survenue lors de l'ex\u00E9cution de la ligne, v\u00E9rifiez que la syntaxe est valide").getAsData());
                System.out.println(coordRunTime);
                arreterExecution();
                resultat = null;
                break;
            }
            // on passe a la coordonnee suivante
            coordRunTime.plusUn();
        }
        return (ligneParsed instanceof Programme.ProgrammeFin || !executionActive || resultat == null) ? datas.toString() : resultat;
    }

    /**
     * fonction executant le scope principal ("main")
     */
    public static String executerMain(boolean resume) {
        executionActive = true;
        // sert au calcul du temps qu'a pris le code pour etre execute
        LocalDateTime before = LocalDateTime.now();

        if (obtenirCoordCompileDict().get("main").isEmpty()) {
            return "[]";
        }

        Object resultat;

        if (!resume) {
            // créer scopeInstance globale
            Scope.pushCurrentScopeInstance(Scope.getCurrentScope().makeScopeInstance(null));
            resultat = executerScope("main", null, null);
        } else resultat = resumeExecution();

        /*
         * affiche si l'execution s'est deroulee sans probleme ou si elle a ete interrompue par une erreur
         * affiche le temps qu'a pris l'execution du programme (au complet ou jusqu'a l'interruption)
         */
        if (coordRunTime.getCoordAsString() == null || !executionActive) {
            System.out.println("execution " + (executionActive ? "done" : "interruped") + " in " +
                    (LocalDateTime.now().toLocalTime().toNanoOfDay() - before.toLocalTime().toNanoOfDay()) / Math.pow(10, 9) + " seconds\n");
            //System.out.println(datas);
            // boolean servant a indique que l'execution est terminee
            executionActive = false;
            reset();
        }
        datas.clear();

        return resultat.toString();
    }

    public static Object resumeExecution() {
        Coordonnee coordActuel = Executeur.obtenirCoordRunTime();
        return Executeur.executerScope(coordActuel.getScope(), null, coordActuel.getCoordAsString());
    }


    /**
     * reset tout a neuf pour la prochaine execution
     */
    private static void reset() {
        Scope.resetAllScope();
        // créer le scope global
        Scope.makeNewCurrentScope();

        ASModule.init();
        // supprime les variables, fonctions et iterateurs de la memoire
        datas.clear();
        FonctionManager.reset();
        DataVoiture.reset();

        Declarer.reset();
        // remet la coordonnee d'execution au debut du programme
        coordRunTime.setCoord(debutCoord.getCoordAsString());
        //if (ast instanceof ASAstExperimental) {
        //    ast = new ASAst();
        //}
    }

    public static void main(String[] args) {
        String[] lines = new String[]{
                "var d = {1...7}",
                "",
                "",
                "",
                "afficher d",
                "",
                "",
                "d[1:4] = {3}",
                "",
                "afficher d"
        };
        debug = true;
        System.out.println(compiler(lines, true));
        //printCompileDict();
        System.out.println(executerMain(false));
        //System.out.println(compiler(lines, false));
        //executerMain(false);
    }
}










