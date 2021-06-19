package interpreteur.as.Objets;


import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.lang.model.type.NullType;

import interpreteur.as.modules.ASModule;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.ast.buildingBlocs.programmes.Boucle;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.tokens.Token;
import interpreteur.as.erreurs.ASErreur.*;


/**
 * Les explications vont être rajouté quand j'aurai la motivation de les écrire XD
 *
 * @author Mathis Laroche
 */


public interface ASObjet<T> {

    T getValue();

    boolean boolValue();

    String obtenirNomType();

    interface Nombre extends ASObjet<Number> {
        @Override
        default String obtenirNomType() {
            return "Nombre";
        }
    }

    interface Iterable extends ASObjet<Object> {
        boolean contient(ASObjet<?> element);

        Iterable sousSection(int debut, int fin);

        ASObjet<?> get(int index);

        int taille();

        Iterator<ASObjet<?>> iter();

        default int idxRelatif(List<?> valeur, int idx) {
            if (Math.abs(idx) > valeur.size()) {
                throw new ErreurIndex("l'index est trop grand");
            }
            idx = (idx < 0) ? valeur.size() + idx : idx;
            return idx;
        }

        @Override
        default String obtenirNomType() {
            return "it\u00E9rable";
        }
    }

    class VariableManager {
        public static final String scopeParDefaut = "main";
        public static Hashtable<String, Hashtable<String, Variable>> varDict = new Hashtable<>();
        public static Hashtable<String, Variable> constDict = new Hashtable<>();
        public static String currentScope = scopeParDefaut;

        public static void ajouterVariable(Variable variable) {
            String nom = FonctionManager.ajouterDansStructure(variable.nom);
            Variable nouv = VariableManager.varDict.get(VariableManager.currentScope).put(nom, variable);
            // if (nouv != null) {
            //     throw new ErreurAssignement("La variable '" + nom + "' a deja ete initialisee");
            // }
        }

        public static void ajouterVariable(Variable variable, String scope) {
            String nom = FonctionManager.ajouterDansStructure(variable.nom);
            varDict.putIfAbsent(scope, new Hashtable<>());
            Variable nouv = VariableManager.varDict.get(scope).put(nom, variable);
            // if (nouv != null) {
            //     throw new ErreurAssignement("La variable '" + nom + "' a deja ete initialisee");
            // }
        }

        public static void ajouterConstante(Constante constante) {
            String nom = FonctionManager.ajouterDansStructure(constante.obtenirNom());
            VariableManager.constDict.put(nom, constante);
            VariableManager.varDict.get(VariableManager.currentScope).put(nom, constante);
        }

        public static void ajouterConstante(Constante constante, String scope) {
            String nom = FonctionManager.ajouterDansStructure(constante.obtenirNom());
            VariableManager.constDict.put(nom, constante);
            varDict.putIfAbsent(scope, new Hashtable<>());
            VariableManager.varDict.get(scope).put(nom, constante);
        }

        public static void initScope(String nomDuScope) {
            varDict.putIfAbsent(nomDuScope, new Hashtable<>());
            varDict.get(nomDuScope).putAll(constDict);
        }

        public static void initScope(String scope, String fromScope) {
            varDict.putIfAbsent(scope, new Hashtable<>());
            Hashtable<String, ASObjet.Variable> varFromScope = new Hashtable<>(varDict.get(fromScope));
            varFromScope.replaceAll((name, var) -> new Variable(var.obtenirNom(), var.getValeur(), var.type).setReadOnly());
            varDict.get(scope).putAll(varFromScope);
        }

        public static void changerScope(String nomDuScope) {
            VariableManager.currentScope = Objects.requireNonNullElse(nomDuScope, scopeParDefaut);
        }

        public static String getCurrentScope() {
            return currentScope;
        }

        public static Variable obtenirVariable(String nom) {
            return VariableManager.varDict.get(VariableManager.currentScope).get(nom);
        }

        public static Variable obtenirVariable(String nom, String nomScope) {
            varDict.putIfAbsent(nomScope, new Hashtable<>());
            return VariableManager.varDict.get(nomScope).get(nom);
        }

        public static boolean estConstante(Variable var) {
            return constDict.containsValue(var);
        }

        public static boolean estConstante(String nom) {
            return constDict.keySet().stream().anyMatch(varName -> varName.equals(nom));
        }

        public static boolean laVariableExiste(String nom) {
            return VariableManager.varDict.get(VariableManager.currentScope).containsKey(nom);
        }

        public static boolean nouvelleValeurValide(String nom, ASObjet<?> nouvelleValeur) {
            Variable var = VariableManager.varDict.get(VariableManager.currentScope).get(nom);

            if (var.getType().noMatch(nouvelleValeur.obtenirNomType())) {
                throw new ErreurAssignement("La variable '" +
                        nom +
                        "' est de type *" +
                        var.obtenirNomType() +
                        "*. Elle ne peut pas prendre une valeur de type *" +
                        nouvelleValeur.obtenirNomType() +
                        "*.");
            }
            return true;
        }

        public static void retirerVariable(String nom) {
            VariableManager.varDict.get(VariableManager.currentScope).remove(nom);
        }

        public static void clearCurrentScope() {
            for (String varNom : VariableManager.varDict.get(VariableManager.currentScope).keySet()) {
                if (!(estConstante(varNom)) && !varDict.get(currentScope).get(varNom).isReadOnly())
                    VariableManager.varDict.get(VariableManager.currentScope).get(varNom).valeur = null;
            }
        }

        public static void reset() {
            VariableManager.varDict = new Hashtable<>();
            VariableManager.constDict = new Hashtable<>();
            VariableManager.currentScope = VariableManager.scopeParDefaut;
            VariableManager.varDict.putIfAbsent(scopeParDefaut, new Hashtable<>());
        }

        public static Hashtable<String, Hashtable<String, Variable>> getVarDict() {
            return varDict;
        }

        public static Hashtable<String, Variable> getConstDict() {
            return constDict;
        }
    }

    class Variable implements ASObjet<Object> {
        private final String nom;
        private final Type type;
        private ASObjet<?> valeur;
        private boolean readOnly = false;

        private Function<ASObjet<?>, ASObjet<?>> getter = null;
        private Function<ASObjet<?>, ASObjet<?>> setter = null;


        public Variable(String nom, ASObjet<?> valeur, Type type) {
            this.type = type;
            this.nom = nom;
            this.valeur = valeur instanceof Variable ? ((Variable) valeur).getValeurApresGetter() : valeur;
        }

        public static void creerOuChangerValeur(String nom, ASObjet<?> valeur, Type type) {
            Variable var = VariableManager.obtenirVariable(nom);
            if (var != null) {
                var.changerValeur(valeur);
            } else {
                VariableManager.ajouterVariable(new Variable(nom, valeur, type));
            }
        }

        public void changerValeur(ASObjet<?> valeur) {
            if (VariableManager.nouvelleValeurValide(this.nom, valeur)) {
                if (this.setter != null) {
                    this.valeur = this.setter.apply(valeur);
                } else {
                    this.valeur = valeur;
                }
                VariableManager.varDict.get(VariableManager.currentScope).put(nom, this);
            }
        }

        public String obtenirNom() {
            return this.nom;
        }

        public Type getType() {
            return type;
        }

        public boolean pasInitialisee() {
            return this.valeur == null;
        }

        public Variable setGetter(Function<ASObjet<?>, ASObjet<?>> getter) {
            this.getter = getter;
            return this;
        }

        public Variable setSetter(Function<ASObjet<?>, ASObjet<?>> setter) {
            this.setter = setter;
            return this;
        }

        public Variable setReadOnly() {
            this.setter = (valeur) -> {
                throw new ErreurAssignement("Cette variable est en lecture seule: elle ne peut pas \u00EAtre modifi\u00E9");
            };
            this.readOnly = true;
            return this;
        }

        public boolean isReadOnly() {
            return readOnly;
        }

        @Override
        public String toString() {
            return "Variable{" +
                    "nom='" + nom + '\'' +
                    ", type='" + type + '\'' +
                    ", valeur=" + valeur +
                    ", getter=" + getter +
                    ", setter=" + setter +
                    '}';
        }


        /* différentes manières de get la valeur stockée dans la variable */
        public ASObjet<?> getValeur() {
            return this.valeur;
        }

        public ASObjet<?> getValeurApresGetter() {
            if (this.valeur == null) {
                throw new ErreurAssignement("la variable " + this.nom + " est initialis\u00E9e, mais pas d\u00E9finie");
            }
            if (this.getter != null) {
                return this.getter.apply(this.valeur);
            }
            return this.valeur;
        }

        @Override
        public Object getValue() {
            if (this.valeur == null) {
                throw new ErreurAssignement("la variable " + this.nom + " est initialis\u00E9e, mais pas d\u00E9finie");
            }
            if (this.getter != null) {
                return this.getter.apply(this.valeur).getValue();
            }
            return this.valeur.getValue();
        }

        @Override
        public boolean boolValue() {
            return this.valeur.boolValue();
        }

        @Override
        public String obtenirNomType() {
            return this.type.getNom();
        }
    }

    class Constante extends Variable {

        public Constante(String nom, ASObjet<?> valeur) {
            super(nom, valeur, new Type("tout"));
        }

        @Override
        public Variable setSetter(Function<ASObjet<?>, ASObjet<?>> setter) {
            throw new ErreurAssignement("Impossible d'attribuer un setter \u00E0 une constante");
        }

        @Override
        public Variable setGetter(Function<ASObjet<?>, ASObjet<?>> getter) {
            throw new ErreurAssignement("Impossible d'attribuer un getter \u00E0 une constante");
        }

        @Override
        public void changerValeur(ASObjet<?> valeur) {
            if (this.getValeur() != null)
                throw new ErreurAssignement("Il est impossible de changer la valeur d'une constante");
            super.changerValeur(valeur);
        }
    }

    class FonctionManager {

        private static String structure = "";

        // met la fonction dans le dictionnaire de fonction et cree enregistre la fonction dans une Variable
        // pour que le code puisse la retrouver plus tard
        public static void ajouterFonction(Fonction fonction) {
            VariableManager.ajouterConstante(new Constante(fonction.getNom(), fonction));
            //fonction.nom = ajouterDansStructure(fonction.getNom());
        }

        public static String obtenirStructure() {
            return structure;
        }

        public static String ajouterDansStructure(String element) {
            return (structure.isBlank() ? "" : structure + ".") + element;
        }

        public static void ajouterStructure(String nomStruct) {
            structure += (structure.isBlank() ? "" : ".") + nomStruct;
        }

        public static void retirerStructure() {
            structure = structure.contains(".") ? structure.substring(0, structure.lastIndexOf(".")) : "";

        }

        public static void reset() {
            FonctionManager.structure = "";
            for (Fonction fonction : ASModule.getModuleBuiltins().getFonctions()) ajouterFonction(fonction);
            for (Variable variable : ASModule.getModuleBuiltins().getVariables()) {
                if (variable instanceof Constante) VariableManager.ajouterConstante((Constante) variable);
                else VariableManager.ajouterVariable(variable);
            }
        }
    }

    class Fonction implements ASObjet<Object> {
        private final Type typeRetour;
        private final Parametre[] parametres; //String[] de forme {nomDuParam�tre, typeDuParam�tre (ou null s'il n'en poss�de pas)}
        private final String nom;
        private Hashtable<String, ASObjet<?>> parametres_appel = new Hashtable<>();  // Object[][] de forme {{nom_param, valeur}, {nom_param2, valeur2}}
        private Coordonnee coordReprise = null;
        private String scopeName;

        /**
         * @param nom        <li>
         *                   Nom de la fonction
         *                   </li>
         * @param typeRetour <li>
         *                   Nom du type de retour de la fonction (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
         *                   </li>
         *                   <li>
         *                   le type du retour peut avoir plusieurs types
         *                   -> separer chaque type par un <b>|</b> (les espaces sont ignores)
         *                   <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
         *                   </li>
         *                   <li>
         *                   Mettre <b>null</b> si le type du retour n'a pas de type forcee
         *                   </li>
         */
        public Fonction(String nom, Type typeRetour) {
            this.nom = nom;
            this.scopeName = "fonc_";
            this.typeRetour = typeRetour;
            this.parametres = new Parametre[0];
        }

        /**
         * @param nom        <li>
         *                   Nom de la fonction
         *                   </li>
         * @param parametres
         * @param typeRetour <li>
         *                   Nom du type de retour de la fonction (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
         *                   </li>
         *                   <li>
         *                   le type du retour peut avoir plusieurs types
         *                   -> separer chaque type par un <b>|</b> (les espaces sont ignores)
         *                   <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
         *                   </li>
         *                   <li>
         *                   Mettre <b>null</b> si le type du retour n'a pas de type forcee
         *                   </li>
         */
        public Fonction(String nom, Parametre[] parametres, Type typeRetour) {
            this.nom = nom;
            this.scopeName = "fonc_";
            this.parametres = parametres;
            this.typeRetour = typeRetour;
        }

        public String getNom() {
            return nom;
        }

        public Type getTypeRetour() {
            return this.typeRetour;
        }

        public Parametre[] getParams() {
            return this.parametres;
        }

        public Hashtable<String, ASObjet<?>> getParamsValeursDict() {
            return this.parametres_appel;
        }

        public ASObjet<?> getValeurParam(String nomParametre) {
            return this.parametres_appel.get(nomParametre);
        }

        /**
         * @return true -> si les parametres sont initialisees <br> false -> s'il n'y a pas de parametres
         * @throws Error une erreur si un des tests n'est pas passe
         */
        public boolean testParams(ArrayList<?> paramsValeurs) {

            if (this.parametres.length == 0 && paramsValeurs.size() == 0) return false;

            int nonDefaultParams = (int) Arrays.stream(parametres).filter(param -> param.getValeurParDefaut() == null).count();

            if (paramsValeurs.size() < nonDefaultParams || paramsValeurs.size() > this.parametres.length) {
                if (nonDefaultParams == this.parametres.length) {
                    throw new ErreurAppelFonction(this.nom, "Le nombre de param\u00E8tres donn\u00E9es est '" + paramsValeurs.size() +
                            "' alors que la fonction en prend '" + this.parametres.length + "'");
                } else {
                    throw new ErreurAppelFonction(this.nom, "Le nombre de param\u00E8tres donn\u00E9es est '" + paramsValeurs.size() +
                            "' alors que la fonction en prend entre '" + nonDefaultParams + "' et '" + this.parametres.length + "'");
                }

            }
            for (int i = 0; i < paramsValeurs.size(); i++) {
                Parametre parametre = this.parametres[i];
                if (parametre.getType().noMatch(((ASObjet<?>) paramsValeurs.get(i)).obtenirNomType())) {
                    throw new ErreurType("Le param\u00E8tres '" + parametre.getNom() + "' est de type '" + parametre.getType().nom() +
                            "', mais l'argument pass\u00E9 est de type '" + ((ASObjet<?>) paramsValeurs.get(i)).obtenirNomType() + "'.");
                }
            }

            return true;

            /*
             * grandement am�liorer les tests ici
             * test � ajouter:
             * 	1. tous les param = valeur sont apr�s les params sans val_defaut
             *
             */
        }

        //		public void afficherParams() {
//			System.out.println("Fonction: " + this.nom);
//			for (Object[] param: this.parametres) {
//				String message = "Param�tre " + param[0] + ": {";
//				for (String m : param) {
//					message += ((m == null || m.equals("null")) ? "tout" : m) + ", ";
//				}
//				System.out.println(message.substring(0, message.length()-2) + "}");
//			};
//		}

        public ASObjet<?> setParamPuisExecute(ArrayList<ASObjet<?>> paramsValeurs) {
            this.parametres_appel = new Hashtable<>();

            if (testParams(paramsValeurs)) {
                /*
                 * Défini la valeur de chaque argument passé explicitement par nom dans l'appel de la fonction
                 * ex: foo(param1=vrai)
                 */
                for (ASObjet<?> param : paramsValeurs) {
                    if (param instanceof Parametre) {
                        if (Arrays.stream(parametres).noneMatch(p -> p.getNom().equals(((Parametre) param).getNom()))) {
                            throw new ErreurAppelFonction("l'argument: " + ((Parametre) param).getNom() + " pass\u00E9 en param\u00E8tre" +
                                    " ne correspond \u00E0 aucun param\u00E8tre d\u00E9fini dans la fonction '" + this.nom + "'");
                        }
                        this.parametres_appel.put(((Parametre) param).getNom(), ((Parametre) param).getValeurParDefaut());
                    }
                }

                for (int i = 0; i < this.parametres.length; i++) {
                    Parametre param = this.parametres[i];
                    if (i < paramsValeurs.size()) {
                        this.parametres_appel.putIfAbsent(param.getNom(), paramsValeurs.get(i));

                    } else {
                        if (param.getValeurParDefaut() == null) {
                            throw new ErreurAppelFonction(this.nom, "l'argument: " + param.getNom() + " n'a pas reçu de valeur" +
                                    "et ne poss\u00E8de aucune valeur par d\u00E9faut");
                        }
                        this.parametres_appel.putIfAbsent(param.getNom(), param.getValeurParDefaut());
                    }
                }

                for (Parametre param : this.parametres) {
                    this.parametres_appel.computeIfAbsent(param.getNom(), (val) -> {
                        if (param.getValeurParDefaut() == null) {
                            throw new ErreurAppelFonction(this.nom, "l'argument: " + param.getNom() + " n'a pas reçu de valeur" +
                                    "et ne poss\u00E8de aucune valeur par d\u00E9faut");
                        }
                        return param.getValeurParDefaut();
                    });
                }
            }
            return this.executer();
        }

        public ASObjet<?> executer() {
            Object valeur;
            ASObjet<?> asValeur;
            String ancienScope = VariableManager.currentScope;
            VariableManager.changerScope(this.scopeName + this.nom);
            VariableManager.initScope(this.scopeName + this.nom, ancienScope);

            for (String param : this.parametres_appel.keySet()) {
                VariableManager.ajouterVariable(new Variable(param, this.parametres_appel.get(param), new Type("tout")));
            }

            Coordonnee ancienneCoord = Executeur.obtenirCoordRunTime().copy();

            valeur = Executeur.executerScope(VariableManager.currentScope, null, coordReprise == null ? null : coordReprise.getCoordAsString());
            if (valeur instanceof String) {
                //System.out.println("valeur: " + valeur);
                coordReprise = Executeur.obtenirCoordRunTime().copy();
                Executeur.setCoordRunTime(ancienneCoord.getCoordAsString());
                VariableManager.changerScope(ancienScope);
                throw new StopSendData((String) valeur);

            } else {
                asValeur = (ASObjet<?>) valeur;
            }

            coordReprise = null;

            Boucle.sortirScope(VariableManager.getCurrentScope());

            Executeur.setCoordRunTime(ancienneCoord.getCoordAsString());
            VariableManager.clearCurrentScope();
            VariableManager.changerScope(ancienScope);

            //System.out.println(this.typeRetour);
            //System.out.println(valeur);
            if (asValeur == null || this.typeRetour.noMatch(asValeur.obtenirNomType())) {
                throw new ErreurType("Le type retourner ' " + (asValeur == null ? "vide" : asValeur.obtenirNomType()) + " ' ne correspond pas "
                        + "au type de retour pr\u00E9cis\u00E9 dans la d\u00E9claration de la fonction ' " + this.typeRetour.nom() + " '.");

            }
            return asValeur;
        }

        public void setScopeName(String scopeName) {
            this.scopeName = scopeName;
        }

        @Override
        public String toString() {
            return this.nom + "(" +
                    String.join(", ", Arrays.stream(this.parametres).map(p -> p.getNom() + ": " + p.obtenirNomType())
                            .toArray(String[]::new)) +
                    ") " +
                    "\u2192 " + this.typeRetour.nom();
        }

        @Override
        public Object getValue() {
            return this;
        }

        @Override
        public boolean boolValue() {
            return true;
        }

        @Override
        public String obtenirNomType() {
            return "fonctionType";
        }

        /**
         * Classe responsable de definir les proprietes des parametres des fonctions
         */
        public static class Parametre implements ASObjet<Object> {
            private final String nom;
            private final Type type;
            private final ASObjet<?> valeurParDefaut;

            /**
             * @param type            <li>
             *                        Nom du type du parametre (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
             *                        </li>
             *                        <li>
             *                        le parametre peut avoir plusieurs types
             *                        -> separer chaque type par un <b>|</b> (les espaces sont ignores)
             *                        <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
             *                        </li>
             *                        <li>
             *                        Mettre <b>null</b> si le parametre n'a pas de type forcee
             *                        </li>
             * @param nom             <li>
             *                        Nom du parametre
             *                        </li>
             * @param valeurParDefaut <li>
             *                        Valeur de type ASObjet qui sera assigne au parametre s'il ne recoit aucune valeur lors de l'appel de la fonction
             *                        </li>
             *                        <li>
             *                        Mettre <b>null</b> pour rendre ce parametre obligatoire lors de l'appel de la fonction
             *                        </li>
             */
            public Parametre(Type type, String nom, ASObjet<?> valeurParDefaut) {
                this.nom = nom;
                this.type = type;
                this.valeurParDefaut = valeurParDefaut;
            }

            public String getNom() {
                return nom;
            }

            public Type getType() {
                return type;
            }

            public ASObjet<?> getValeurParDefaut() {
                return valeurParDefaut;
            }

            @Override
            public Object getValue() {
                return null;
            }

            @Override
            public boolean boolValue() {
                return false;
            }

            @Override
            public String obtenirNomType() {
                return this.type.nom();
            }

            @Override
            public String toString() {
                return "Parametre{" +
                        "nom='" + nom + '\'' +
                        ", type=" + type +
                        ", valeurParDefaut=" + valeurParDefaut +
                        '}';
            }

        }
    }

    class Entier implements Nombre {
        private final int valeur;

        public Entier(Token valeur) {
            try {
                this.valeur = Integer.parseInt(valeur.obtenirValeur());
            } catch (NumberFormatException e) {
                throw new ErreurEntierInvalide("Les nombres entiers doivent avoir une valeur entre "
                        + Integer.MIN_VALUE + " et " + Integer.MAX_VALUE);
            }
        }

        public Entier(Number valeur) {
            try {
                this.valeur = valeur.intValue();
            } catch (NumberFormatException e) {
                throw new ErreurEntierInvalide("Les nombres entiers doivent avoir une valeur entre "
                        + Integer.MIN_VALUE + " et " + Integer.MAX_VALUE);
            }
        }


        @Override
        public String toString() {
            return this.getValue().toString();
        }

        @Override
        public Integer getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return this.valeur != 0;
        }

        @Override
        public String obtenirNomType() {
            return "entier";
        }
    }

    class Decimal implements Nombre {
        private final double valeur;

        public Decimal(Token valeur) {
            String val = valeur.obtenirValeur();
            if (val.startsWith(".")) val = "0" + val;
            else if (val.endsWith(".")) val += "0";
            this.valeur = Double.parseDouble(val);
        }

        public Decimal(Number valeur) {
            this.valeur = valeur.doubleValue();
        }

        @Override
        public String toString() {
            return this.getValue().toString();
        }

        @Override
        public Double getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return this.valeur != 0;
        }

        @Override
        public String obtenirNomType() {
            return "decimal";
        }
    }

    class Booleen implements ASObjet<Boolean> {
        private final boolean valeur;

        public Booleen(Token valeur) {
            this.valeur = valeur.obtenirValeur().equals("vrai");
        }

        public Booleen(ASObjet<?> valeur) {
            this.valeur = Boolean.parseBoolean(valeur.getValue().toString());
        }

        public Booleen(Boolean valeur) {
            this.valeur = valeur;
        }

        @Override
        public String toString() {
            return valeur ? "vrai" : "faux";
        }

        @Override
        public Boolean getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return this.getValue();
        }

        @Override
        public String obtenirNomType() {
            return "booleen";
        }
    }

    class Nul implements ASObjet<NullType> {

        public Nul() {
        }

        @Override
        public String toString() {
            return "nul";
        }

        @Override
        public NullType getValue() {
            return null;
        }

        @Override
        public boolean boolValue() {
            return false;
        }

        @Override
        public String obtenirNomType() {
            return "nulType";
        }
    }

    class Texte implements Iterable {
        private final String valeur;

        public Texte(Token valeur) {
            this.valeur = valeur.obtenirValeur().substring(1, valeur.obtenirValeur().length() - 1);
        }

        public Texte(Object valeur) {
            this.valeur = String.valueOf(valeur);
        }

        public Texte[] arrayDeLettres() {
            Texte[] array = new Texte[this.getValue().length()];
            int i = 0;
            for (char lettre : this.getValue().toCharArray()) {
                array[i] = new Texte(lettre);
                i++;
            }
            return array;
        }

        @Override
        public String toString() {
            return this.getValue();
        }

        @Override
        public String getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return !this.valeur.isEmpty();
        }

        @Override
        public boolean contient(ASObjet<?> element) {
            if (element.getValue() instanceof String) {
                return this.valeur.contains((String) element.getValue());
            } else {
                return false;
            }
        }

        @Override
        public Iterable sousSection(int debut, int fin) {
            return new Texte(this.valeur.substring(debut, idxRelatif(Arrays.asList(this.arrayDeLettres()), fin)));
        }

        @Override
        public ASObjet<?> get(int index) {
            return new Texte(this.valeur.charAt(idxRelatif(Arrays.asList(this.arrayDeLettres()), index)));
        }

        @Override
        public int taille() {
            return this.valeur.length();
        }

        @Override
        public Iterator<ASObjet<?>> iter() {
            return Arrays.asList((ASObjet<?>[]) this.arrayDeLettres()).iterator();
        }

        @Override
        public String obtenirNomType() {
            return "texte";
        }
    }

    class Liste implements Iterable {
        private ArrayList<ASObjet<?>> valeur = new ArrayList<>();

        public Liste() {
        }

        public Liste(ASObjet<?>[] valeurs) {
            this.valeur = new ArrayList<>(Arrays.asList(valeurs));
        }

        public void ajouterElement(ASObjet<?> element) {
            this.valeur.add(element);
        }

        public Liste ajouterTout(Liste elements) {
            this.valeur.addAll(elements.getValue());
            return this;
        }

        public void retirerElement(int idx) {
            this.valeur.remove(idxRelatif(this.valeur, idx));
        }


        public Liste remplacer(int idx, ASObjet<?> valeur) {
            this.valeur.set(idxRelatif(this.valeur, idx), valeur);
            return this;
        }

        public Liste remplacer(ASObjet<?> valeur, ASObjet<?> remplacement) {
            this.valeur.replaceAll(v -> v.equals(valeur) ? remplacement : v);
            return this;
        }

        public Liste remplacerRange(int debut, int fin, Liste remplacement) {
            debut = idxRelatif(valeur, debut);
            fin = idxRelatif(valeur, fin);
            this.valeur = this.sousSection(0, debut).ajouterTout(remplacement).ajouterTout(this.sousSection(fin, this.taille())).getValue();
            return this;
        }

        public ArrayList<?> map(Function<ASObjet<?>, ?> mappingFunction) {
            return this.valeur.stream().map(mappingFunction).collect(Collectors.toCollection(ArrayList::new));
        }

        @Override
        public ASObjet<?> get(int idx) {
            return this.valeur.get(idxRelatif(this.valeur, idx));
        }

        @Override
        public int taille() {
            return this.valeur.size();
        }

        @Override
        public Iterator<ASObjet<?>> iter() {
            return this.valeur.iterator();
        }

        @Override
        public boolean contient(ASObjet<?> element) {
            return this.valeur.contains(element);
        }

        @Override
        public SousListe sousSection(int debut, int fin) {
            return new SousListe(this, debut, idxRelatif(this.valeur, fin));
        }

        @Override
        public String toString() {
            return "{" +
                    String.join(", ", this.valeur
                            .stream()
                            .map(e -> e instanceof Texte ? '"' + e.toString() + '"' : e.toString())
                            .toArray(String[]::new))
                    + "}";
        }

        @Override
        public ArrayList<ASObjet<?>> getValue() {
            return this.valeur;
        }

        @Override
        public boolean boolValue() {
            return !this.valeur.isEmpty();
        }


        @Override
        public String obtenirNomType() {
            return "liste";
        }

        public static class SousListe extends Liste {
            private final Liste parent;

            SousListe(Liste parent, int debut, int fin) {
                super(parent.valeur.subList(debut, fin).toArray(ASObjet<?>[]::new));
                this.parent = parent;
            }

            public Liste getParent() {
                return parent;
            }
        }
    }
}



















