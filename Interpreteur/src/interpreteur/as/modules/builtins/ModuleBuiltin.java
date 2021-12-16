package interpreteur.as.modules.builtins;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.*;
import interpreteur.as.lang.datatype.*;
import interpreteur.as.modules.core.ASModule;
import interpreteur.as.lang.ASType;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.function.Supplier;

public class ModuleBuiltin {
    private static final Supplier<ASObjet<?>> getVarsLocales = () -> {
        List<ASVariable> variableList = new ArrayList<>(ASScope.getCurrentScopeInstance().getVariableStack());
        return new ASListe(variableList.stream().map(var -> new ASTexte(var.obtenirNom())).toArray(ASTexte[]::new));
    };
    private static final Supplier<ASObjet<?>> getVarsGlobales = () -> {
        List<ASVariable> variableList = new ArrayList<>(ASScope.getScopeInstanceStack().firstElement().getVariableStack());
        return new ASListe(variableList.stream().map(var -> new ASTexte(var.obtenirNom())).toArray(ASTexte[]::new));
    };
    private static final Supplier<ASObjet<?>> getVarListe = () -> {
        HashSet<ASVariable> variables = new HashSet<>();
        ASScope.getScopeInstanceStack().forEach(scopeInstance -> variables.addAll(scopeInstance.getVariableStack()));
        return new ASListe(variables.stream().map(var -> new ASTexte(var.obtenirNom())).toArray(ASTexte[]::new));
    };

    /*
     * Module builtins: contient toutes les fonctions utiliser par defaut dans le langage
     */
    //public static List<ASObjet.Fonction> fonctions =
    public static ASVariable[] variables = new ASVariable[]{
            new ASConstante("bob", new ASTexte("(~°3°)~")),
            new ASConstante("finl", new ASTexte("\n")),
            new ASVariable("varLocales", new ASListe(), ASTypeBuiltin.liste.asType()).setGetter(getVarsLocales).setReadOnly(),
            new ASVariable("varGlobales", new ASListe(), ASTypeBuiltin.liste.asType()).setGetter(getVarsGlobales).setReadOnly(),
            new ASVariable("varListe", new ASListe(), ASTypeBuiltin.liste.asType()).setGetter(getVarListe).setReadOnly(),
    };

    public static ASModule charger(Executeur executeurInstance) {
        ASFonctionModule[] fonctionModules = new ASFonctionModule[]{

                new ASFonctionModule("afficher", ASTypeBuiltin.rien.asType(), new ASParametre[]{
                        new ASParametre(new ASType("tout"), "element", new ASTexte(""))
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> element = this.getValeurParam("element");
                        executeurInstance.addData(new Data(Data.Id.AFFICHER).addParam(element.toString()));
                        executeurInstance.ecrire(element.toString());
                        return new ASNul();
                    }
                },

                new ASFonctionModule("attendre", ASTypeBuiltin.rien.asType(), new ASParametre[]{
                        new ASParametre(new ASType("nombre"), "duree", new ASEntier(0))
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> duree = this.getValeurParam("duree");
                        executeurInstance.addData(new Data(Data.Id.ATTENDRE).addParam(((Number) duree.getValue()).doubleValue()));
                        return new ASNul();
                    }
                },

                /*
                 * aleatoire:
                 * 		@param choix:
                 * 			-> type: liste ou texte
                 * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
                 *
                 * 		@type_retour null (aucune contrainte sur le type retourne)
                 *
                 * 		@return -> si "choix" est de type liste: un element aleatoirement choisi dans la liste
                 * 				-> si "choix" est de type texte: une lettre aleatoirement choisi dans le texte
                 */
                new ASFonctionModule("aleatoire", new ASType("tout"), new ASParametre[]{
                        new ASParametre(new ASType("iterable"), "choix", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        if (this.getParamsValeursDict().get("choix") instanceof ASListe liste) {
                            return liste.get((int) (Math.random() * liste.taille()));
                        } else {
                            ASTexte texte = (ASTexte) this.getParamsValeursDict().get("choix");
                            return new ASTexte(texte.getValue().charAt((int) (Math.random() * texte.taille())));
                        }
                    }
                },

                /*
                 * typeDe:
                 * 		@param objet:
                 * 			-> type: null (aucune contrainte sur le type)
                 * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
                 *
                 * 		@type_retour texte
                 *
                 * 		@return le nom du type de l'objet passe en parametre dans un "texte"
                 */
                new ASFonctionModule("typeDe", new ASType("texte"), new ASParametre[]{
                        new ASParametre(new ASType("tout"), "element", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASTexte(this.getParamsValeursDict().get("element").obtenirNomType());
                    }
                },

                new ASFonctionModule("booleen", ASTypeBuiltin.booleen.asType(), new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.tout.asType(), "element", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        return new ASBooleen(this.getParamsValeursDict().get("element").boolValue());
                    }
                },

                new ASFonctionModule("auto", ASTypeBuiltin.tout.asType(), new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.texte.asType(), "txt", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        var txt = ((ASTexte) this.getValeurParam("txt")).getValue().trim();
                        if (ASNombre.estNumerique(txt)) {
                            ASNombre.parse(this.getValeurParam("txt"));
                        } else if (ASBooleen.estBooleen(txt)) {
                            return new ASBooleen(txt);
                        }
                        return new ASTexte(txt);
                    }
                },

                new ASFonctionModule("clef", ASTypeBuiltin.texte.asType(), new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.paire.asType(), "_paire", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        return ((ASPaire) getValeurParam("_paire")).clef();
                    }
                },

                new ASFonctionModule("val", ASTypeBuiltin.texte.asType(), new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.paire.asType(), "_paire", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        return ((ASPaire) getValeurParam("_paire")).valeur();
                    }
                },



                /*
                 * affiche le commentaire entre les symboles
                 * (-:
                 *  -
                 * :-)
                 * dans la fonction passée en paramètre
                 *
                 */
                new ASFonctionModule("info", new ASType("tout"), new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.tout.asType(), "element", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        return this.getParamsValeursDict().get("element");
                    }
                },

                new ASFonctionModule("getVar", new ASType("tout"), new ASParametre[]{
                        new ASParametre(ASTypeBuiltin.texte.asType(), "nomVariable", null)
                }) {
                    @Override
                    public ASObjet<?> executer() {
                        String nomVar = (String) this.getValeurParam("nomVariable").getValue();
                        ASVariable var = ASScope.getCurrentScopeInstance().getVariable(nomVar);
                        if (var == null) {
                            throw new ASErreur.ErreurVariableInconnue("La variable '" + nomVar + "' n'est pas d\u00E9clar\u00E9e dans ce scope.");
                        }
                        return var.getValeurApresGetter();
                    }
                }
        };

        var fonctionsBuiltins = new ArrayList<>(List.of(fonctionModules));
        fonctionsBuiltins.addAll(List.of(BuiltinsListeUtils.fonctionModules));
        fonctionsBuiltins.addAll(List.of(BuiltinsTexteUtils.fonctionModules));
        fonctionsBuiltins.addAll(List.of(BuiltinsNombreUtils.fonctionModules));

        return new ASModule(fonctionsBuiltins.toArray(ASFonctionModule[]::new), variables);
    }
}
















