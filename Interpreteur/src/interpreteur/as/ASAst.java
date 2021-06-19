package interpreteur.as;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import interpreteur.as.ASErreur.*;
import interpreteur.as.ASObjet.Booleen;
import interpreteur.as.ASObjet.Decimal;
import interpreteur.as.ASObjet.Entier;
import interpreteur.as.ASObjet.FonctionManager;
import interpreteur.as.ASObjet.Nul;
import interpreteur.as.ASObjet.Texte;
import interpreteur.as.ASObjet.Variable;
import interpreteur.as.ASObjet.VariableManager;
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


public class ASAst extends AstGenerator {
    public ASAst() {
        VariableManager.varDict.putIfAbsent(VariableManager.scopeParDefaut, new Hashtable<>());
        ajouterProgrammes();
        ajouterExpressions();
    }


    private void ajouterProgrammes() {
        ajouterProgramme("", new Ast<NullType>() {
            @Override
            public NullType apply(List<Object> p) {
                return null;
            }
        });

        ajouterProgramme("UTILISER expression~"
                        + "UTILISER expression LISTE_OUV expression LISTE_FERM",
                new Ast<Utiliser>() {
                    @Override
                    public Utiliser apply(List<Object> p) {
                        if (p.size() > 2) {
                            Var[] sous_modules;
                            if (p.get(3) instanceof CreerListe.Enumeration) {
                                sous_modules = ((CreerListe.Enumeration) p.get(3)).getExprs().toArray(Var[]::new);
                            } else {
                                sous_modules = new Var[]{(Var) p.get(3)};
                            }
                            return new Utiliser((Var) p.get(1), sous_modules);
                        }
                        return new Utiliser((Var) p.get(1));
                    }
                });

        ajouterProgramme("AFFICHER expression", new Ast<Afficher>() {
            @Override
            public Afficher apply(List<Object> p) {
                return new Afficher((Expression<?>) p.get(1));
            }
        });

        ajouterProgramme("LIRE DANS expression",
                new Ast<Lire>() {
                    @Override
                    public Lire apply(List<Object> p) {
                        System.out.println(p);
                        if (!(p.get(2) instanceof Var)) {
                            throw new ErreurInputOutput("Une variable est attendue apr\u00E8s la commande 'lire', mais '" +
                                    p.get(2).getClass().getSimpleName() + "' a \u00E9t\u00E9 trouv\u00E9.");
                        }
                        return new Lire((Var) p.get(2), null);
                    }
                });

        ajouterProgramme("ATTENDRE expression", new Ast<Attendre>() {
            @Override
            public Attendre apply(List<Object> p) {
                return new Attendre((Expression<?>) p.get(1));
            }
        });

        ajouterProgramme("CONSTANTE expression ASSIGNEMENT expression~"
                        + "expression {assignements} expression",
                //+ "{nom_type_de_donnees} NOM_VARIABLE ASSIGNEMENT expression",
                new Ast<Assigner>() {
                    @Override
                    public Assigner apply(List<Object> p) {
                        /*
                         * TODO erreur si c'est pas une Var qui est passé comme expression à gauche de l'assignement
                         */

                        if (p.size() == 3) {
                            BinOp.Operation op = null;
                            if (!((Token) p.get(1)).obtenirNom().equals("ASSIGNEMENT")) {
                                op = BinOp.Operation.valueOf(((Token) p.get(1)).obtenirNom().split("_")[0]);
                            }
                            if (p.get(2) instanceof CreerListe.Enumeration)
                                p.set(2, ((CreerListe.Enumeration) p.get(2)).build());
                            return new Assigner((Expression<?>) p.get(0), (Expression<?>) p.get(2), false, op);
                        } else {
                            if (p.get(3) instanceof CreerListe.Enumeration)
                                p.set(3, ((CreerListe.Enumeration) p.get(3)).build());
                            return new Assigner((Expression<?>) p.get(1), (Expression<?>) p.get(3), true, null);
                        }
                    }
                });

        ajouterProgramme("{methode_moteur} expression~"
                        + "{methode_moteur}",
                new Ast<MethodeMoteur>(0) {
                    @Override
                    public MethodeMoteur apply(List<Object> p) {
                        String nom = ((Token) p.get(0)).obtenirNom();

                        return new MethodeMoteur(nom, p.size() > 1 ? (Expression<?>) p.get(1) : null);
                    }
                });

        ajouterProgramme("STRUCTURE NOM_VARIABLE", new Ast<Programme>() {
            @Override
            public Programme apply(List<Object> p) {
                return new Programme() {
                    @Override
                    public Object execute() {
                        FonctionManager.ajouterStructure(((Token) p.get(1)).obtenirValeur());
                        return null;
                    }

                    @Override
                    public String toString() {
                        return "";
                    }
                };
            }
        });

        ajouterProgramme("FIN STRUCTURE", new Ast<Programme>() {
            @Override
            public Programme apply(List<Object> p) {
                return new Programme() {
                    @Override
                    public Object execute() {
                        FonctionManager.ajouterStructure(((Token) p.get(1)).obtenirValeur());
                        return null;
                    }

                    @Override
                    public String toString() {
                        return "FinStructure";
                    }
                };
            }
        });

        //<-----------------------------------Les getters----------------------------------------->//
        ajouterProgramme("GET NOM_VARIABLE~" +
                        "GET NOM_VARIABLE FLECHE expression",
                new Ast<CreerGetter>(
                        new Object[]{"expression PIPE expression",
                                new Ast<Type>(1) {
                                    @Override
                                    public Type apply(List<Object> p) {
                                        assert p.get(0) instanceof Type && p.get(2) instanceof Type;
                                        return new Type(((Type) p.get(0)).getNom() + "|" + ((Type) p.get(2)).getNom());
                                    }
                                }}) {
                    @Override
                    public CreerGetter apply(List<Object> p) {
                        Type type = null;
                        if (p.size() > 2) {
                            if (!(p.get(3) instanceof Type)) {
                                throw new ErreurType("'" + p.get(4) + "' n'est pas un type valide");
                            }
                            type = (Type) p.get(3);
                        }
                        return new CreerGetter(new Var(((Token) p.get(1)).obtenirValeur()), type);
                    }
                });

        ajouterProgramme("FIN GET",
                new Ast<FinFonction>() {
                    @Override
                    public FinFonction apply(List<Object> p) {
                        return new FinFonction();
                    }
                });

        //<-----------------------------------Les setters----------------------------------------->//
        ajouterProgramme("SET NOM_VARIABLE PARENT_OUV NOM_VARIABLE PARENT_FERM~" +
                        "SET NOM_VARIABLE PARENT_OUV NOM_VARIABLE DEUX_POINTS expression PARENT_FERM",
                new Ast<CreerSetter>(new Object[]{"{nom_type_de_donnees}",
                        new Ast<Type>(0) {
                            @Override
                            public Type apply(List<Object> p) {
                                assert p.get(0) instanceof Token;
                                return new Type(((Token) p.get(0)).obtenirValeur());
                            }
                        }},
                        new Object[]{"expression PIPE expression",
                                new Ast<Type>(1) {
                                    @Override
                                    public Type apply(List<Object> p) {
                                        assert p.get(0) instanceof Type && p.get(2) instanceof Type;
                                        return new Type(((Type) p.get(0)).getNom() + "|" + ((Type) p.get(2)).getNom());
                                    }
                                }}) {
                    @Override
                    public CreerSetter apply(List<Object> p) {
                        Type type = null;
                        if (p.size() > 5) {
                            if (!(p.get(5) instanceof Type)) {
                                throw new ErreurType("'" + p.get(5) + "' n'est pas un type valide");
                            }
                            type = (Type) p.get(5);
                        }
                        return new CreerSetter(new Var(((Token) p.get(1)).obtenirValeur()), new Var(((Token) p.get(3)).obtenirValeur()), type);
                    }
                });

        ajouterProgramme("FIN SET",
                new Ast<FinFonction>() {
                    @Override
                    public FinFonction apply(List<Object> p) {
                        return new FinFonction();
                    }
                });

        //<-----------------------------------Les fonctions----------------------------------------->//

        ajouterProgramme("FONCTION expression PARENT_OUV expression PARENT_FERM FLECHE expression~" +
                        "FONCTION expression PARENT_OUV expression PARENT_FERM",
                new Ast<CreerFonction>(
                        new Object[]{"expression DEUX_POINTS expression ASSIGNEMENT expression~"
                                + "expression ASSIGNEMENT expression~"
                                + "expression DEUX_POINTS expression",
                                new Ast<Argument>(11) {
                                    @Override
                                    public Argument apply(List<Object> p) {
                                        return new Argument(
                                                (Var) p.get(0),

                                                ((Token) p.get(1)).obtenirNom().equals("ASSIGNEMENT")
                                                        ? (Expression<?>) p.get(2) : p.size() == 5 ? (Expression<?>) p.get(p.size() - 1) : null,

                                                ((Token) p.get(1)).obtenirNom().equals("DEUX_POINTS")
                                                        ? (Type) p.get(2) : null);
                                    }
                                }},
                        new Object[]{"{nom_type_de_donnees}",
                                new Ast<Type>(0) {
                                    @Override
                                    public Type apply(List<Object> p) {
                                        assert p.get(0) instanceof Token;
                                        return new Type(((Token) p.get(0)).obtenirValeur());
                                    }
                                }},
                        new Object[]{"expression PIPE expression",
                                new Ast<Type>(1) {
                                    @Override
                                    public Type apply(List<Object> p) {
                                        assert p.get(0) instanceof Type && p.get(2) instanceof Type;
                                        return new Type(((Type) p.get(0)).getNom() + "|" + ((Type) p.get(2)).getNom());
                                    }
                                }}
                ) {
                    @Override
                    public CreerFonction apply(List<Object> p) {
                        Argument[] params = new Argument[]{};

                        Type typeRetour = p.get(p.size() - 1) instanceof Type ? (Type) p.get(p.size() - 1) : null;

                        if (p.get(p.size() - 1) == null && p.get(3) instanceof Type) {
                            typeRetour = (Type) p.get(3);
                            return new CreerFonction((Var) p.get(1), params, typeRetour);
                        }

                        if (p.get(3) != null && !(p.get(3) instanceof Token)) {
                            if (p.get(3) instanceof CreerListe.Enumeration) {
                                params = ((CreerListe.Enumeration) p.get(3)).getExprs()
                                        .stream()
                                        .map(expr -> expr instanceof Argument ? (Argument) expr : new Argument((Var) expr, null, null))
                                        .toArray(Argument[]::new);
                            } else if (p.get(3) instanceof Argument) {
                                params = new Argument[]{
                                        (Argument) p.get(3)
                                };
                            } else {
                                params = new Argument[]{
                                        new Argument((Var) p.get(3), null, null)
                                };
                            }
                        }

                        return new CreerFonction((Var) p.get(1), params, typeRetour);
                    }
                });

        ajouterProgramme("RETOURNER~" +
                        "RETOURNER expression",
                new Ast<Retourner>() {
                    @Override
                    public Retourner apply(List<Object> p) {
                        return new Retourner(p.size() > 1 ? (Expression<?>) p.get(1) : new ValeurConstante(new Nul()));
                    }
                });


        ajouterProgramme("FIN FONCTION", new Ast<FinFonction>(0) {
            @Override
            public FinFonction apply(List<Object> p) {
                return new FinFonction();
            }
        });


        //<-----------------------------------Les blocs de code------------------------------------->
        ajouterProgramme("SI expression",
                new Ast<Si>() {
                    @Override
                    public Si apply(List<Object> p) {
                        return new Si((Expression<?>) p.get(1));
                    }
                });


        ajouterProgramme("SINON",
                new Ast<Sinon>(0) {
                    @Override
                    public Sinon apply(List<Object> p) {
                        return new Sinon();
                    }
                });

        ajouterProgramme("FIN SI", new Ast<FinSi>() {
            @Override
            public FinSi apply(List<Object> p) {
                return new FinSi();
            }
        });

        ajouterProgramme("FAIRE",
                new Ast<Programme>() {
                    @Override
                    public Programme apply(List<Object> p) {
                        return new Programme() {
                            @Override
                            public NullType execute() {
                                Executeur.obtenirCoordRunTime().nouveauBloc("faire");
                                return null;
                            }

                            @Override
                            public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
                                return Executeur.obtenirCoordRunTime().nouveauBloc("faire");
                            }

                            @Override
                            public String toString() {
                                return "BoucleFaire";
                            }
                        };
                    }
                });

        ajouterProgramme("TANT_QUE expression",
                new Ast<BoucleTantQue>(0) {
                    @Override
                    public BoucleTantQue apply(List<Object> p) {
                        return new BoucleTantQue((Expression<?>) p.get(1));
                    }
                });

        ajouterProgramme("REPETER expression", new Ast<BoucleRepeter>() {
            @Override
            public BoucleRepeter apply(List<Object> p) {
                return new BoucleRepeter((Expression<?>) p.get(1));
            }
        });

        ajouterProgramme("POUR expression DANS expression",
                new Ast<BouclePour>(0) {
                    @Override
                    public BouclePour apply(List<Object> p) {
                        return new BouclePour((Var) p.get(1), (Expression<?>) p.get(3));
                    }
                });

        ajouterProgramme("SORTIR", new Ast<Boucle.Sortir>() {
            @Override
            public Boucle.Sortir apply(List<Object> p) {
                return new Boucle.Sortir();
            }
        });

        ajouterProgramme("CONTINUER", new Ast<Boucle.Continuer>() {
            @Override
            public Boucle.Continuer apply(List<Object> p) {
                return new Boucle.Continuer();
            }
        });

        ajouterProgramme("FIN POUR~"
                        + "FIN TANT_QUE~"
                        + "FIN REPETER",
                new Ast<FinBoucle>() {
                    @Override
                    public FinBoucle apply(List<Object> p) {
                        return new FinBoucle(((Token) p.get(1)).obtenirValeur());
                    }
                });

        ajouterProgramme("expression", new Ast<Programme>() {
            @Override
            public Programme apply(List<Object> p) {
                return new Programme() {
                    @Override
                    public Object execute() {
                        ((Expression<?>) p.get(0)).eval();
                        return null;
                    }

                    @Override
                    public String toString() {
                        return p.get(0).toString();
                    }
                };
            }
        });
        setOrdreProgramme();
    }


    private void ajouterExpressions() {

        ajouterExpression("NOM_VARIABLE", new Ast<Var>(0) {
            @Override
            public Var apply(List<Object> p) {
                return new Var(((Token) p.get(0)).obtenirValeur());
            }
        });

        ajouterExpression("{nom_type_de_donnees}", new Ast<Type>(1) {
            @Override
            public Type apply(List<Object> p) {
                return new Type(((Token) p.get(0)).obtenirValeur());
            }
        });


        //call fonction
        ajouterExpression("expression PARENT_OUV #expression PARENT_FERM~"
                        + "expression PARENT_OUV PARENT_FERM",
                new Ast<AppelFonc>(2) {
                    @Override
                    public AppelFonc apply(List<Object> p) {
                        if (p.size() == 3) {
                            Expression<?> nom = p.get(0) instanceof Type ? new Var(((Type) p.get(0)).getNom()) : (Expression<?>) p.get(0);
                            return new AppelFonc(nom, new CreerListe());
                        }
                        Hashtable<String, Ast<?>> astParams = new Hashtable<>();

                        //astParams.put("expression DEUX_POINTS expression", new Ast<Argument>(8){
                        //    @Override
                        //    public Argument apply(List<Object> p) {
                        //        assert p.get(0) instanceof Var : "gauche assignement doit être Var (source: appelFonction dans ASAst)";
                        //
                        //        return new Argument((Var) p.get(0), (Expression<?>) p.get(2), null);
                        //    }
                        //});
                        Expression<?> contenu = AstGenerator.eval(new ArrayList<>(p.subList(2, p.size() - 1)), astParams).get(0);

                        CreerListe args = contenu instanceof CreerListe.Enumeration ?
                                ((CreerListe.Enumeration) contenu).build() :
                                new CreerListe(contenu);


                        final Expression<?> nom;

                        if (p.get(0) instanceof Type) {
                            nom = new Var(((Type) p.get(0)).getNom());
                        } else {
                            nom = (Expression<?>) p.get(0);
                        }

                        return new AppelFonc(nom, args);
                    }
                });


        ajouterExpression("PARENT_OUV #expression PARENT_FERM~"
                        + "PARENT_OUV expression PARENT_FERM",
                new Ast<Expression<?>>(3) {
                    @Override
                    public Expression<?> apply(List<Object> p) {
                        return AstGenerator.eval(new ArrayList<>(p.subList(1, p.size() - 1)), null).get(0);
                    }
                });

        ajouterExpression("PIPE #expression PIPE",
                new Ast<UnaryOp>(4) {
                    @Override
                    public UnaryOp apply(List<Object> p) {
                        Expression<?> expr = AstGenerator.eval(new ArrayList<>(p.subList(1, p.size() - 1)), null).get(0);
                        return new UnaryOp(expr, UnaryOp.Operation.ABSOLUE);
                    }
                });

        ajouterExpression("{type_de_donnees}", new Ast<ValeurConstante>(5) {
            @Override
            public ValeurConstante apply(List<Object> p) {
                Token valeur = (Token) p.get(0);
                String nom = valeur.obtenirNom();
                return new ValeurConstante(switch (nom) {
                    case "ENTIER" -> new Entier(valeur);
                    case "DECIMAL" -> new Decimal(valeur);
                    case "TEXTE" -> new Texte(valeur);
                    case "BOOLEEN" -> new Booleen(valeur);
                    case "NUL" -> new Nul();
                    default -> throw new ErreurType("Type de donnee invalide");
                });
            }
        });

        ajouterExpression("!expression MOINS expression",
                new Ast<UnaryOp>(6) {
                    @Override
                    public UnaryOp apply(List<Object> p) {
                        return new UnaryOp((Expression<?>) p.get(1), UnaryOp.Operation.NEGATION);
                    }
                });

        ajouterExpression("LISTE_OUV expression TROIS_POINT expression LISTE_FERM~"
                        + "LISTE_OUV expression TROIS_POINT expression BOND expression LISTE_FERM",
                new Ast<Suite>(7) {
                    /**
                     * {1...10} -> {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
                     * {"a"..."g"} -> {"a", "b", "c", "d", "e", "f", "g"}
                     * {"A"..."G"} -> {"A", "B", "C", "D", "E", "F", "G"}
                     */
                    @Override
                    public Suite apply(List<Object> p) {
                        return new Suite((Expression<?>) p.get(1), (Expression<?>) p.get(3),
                                p.size() == 5 ? null : (Expression<?>) p.get(5));
                    }
                });


        ajouterExpression("LISTE_OUV LISTE_FERM~" +
                        "LISTE_OUV #expression LISTE_FERM",
                new Ast<CreerListe>(8) {
                    @Override
                    public CreerListe apply(List<Object> p) {
                        if (p.size() < 3) return new CreerListe();
                        Expression<?> contenu = AstGenerator.eval(new ArrayList<>(p.subList(1, p.size() - 1)), null).get(0);
                        if (contenu instanceof CreerListe.Enumeration)
                            return ((CreerListe.Enumeration) contenu).build();
                        return new CreerListe(contenu);
                    }
                });


        ajouterExpression("expression CROCHET_OUV expression CROCHET_FERM~"
                        + "expression CROCHET_OUV DEUX_POINTS CROCHET_FERM~"
                        + "expression CROCHET_OUV expression DEUX_POINTS expression CROCHET_FERM~"
                        + "expression CROCHET_OUV expression DEUX_POINTS CROCHET_FERM~"
                        + "expression CROCHET_OUV DEUX_POINTS expression CROCHET_FERM",
                new Ast<CreerListe.SousSection>(9) {
                    @Override
                    public CreerListe.SousSection apply(List<Object> p) {

                        if (p.size() == 4) {
                            if (p.get(2) instanceof Token) {
                                return new CreerListe.SousSection.CreerSousSection((Expression<?>) p.get(0), null, null);
                            }
                            Expression<?> idx = (Expression<?>) p.get(2);
                            return new CreerListe.SousSection.IndexSection((Expression<?>) p.get(0), idx);
                        }

                        Expression<?> debut = p.get(2) instanceof Token ? null : (Expression<?>) p.get(2);
                        Expression<?> fin = p.get(p.size() - 2) instanceof Token ? null : (Expression<?>) p.get(p.size() - 2);
                        return new CreerListe.SousSection.CreerSousSection((Expression<?>) p.get(0), debut, fin);
                    }
                });

        ajouterExpression("expression PLUS PLUS~"
                        + "expression MOINS MOINS",
                new Ast<Incrementer>(10) {
                    @Override
                    public Incrementer apply(List<Object> p) {
                        final byte signe;
                        if (((Token) p.get(1)).obtenirNom().equals("MOINS")) signe = -1;
                        else signe = 1;
                        return new Incrementer((Expression<?>) p.get(0), signe);
                    }
                });


        final int start = 11;
        ajouterExpression("expression MOD expression", new Ast<BinOp>(start) {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.MOD, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression POW expression", new Ast<BinOp>(start + 1) {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.POW, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression MUL expression", new Ast<BinOp>(start + 2) {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.MUL, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression DIV expression", new Ast<BinOp>(start + 3) {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.DIV, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression DIV_ENTIERE expression", new Ast<BinOp>(start + 3) {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.DIV_ENTIERE, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression PLUS expression", new Ast<BinOp>(start + 4) {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.PLUS, (Expression<?>) p.get(2));
            }
        });

        ajouterExpression("expression MOINS expression", new Ast<BinOp>(start + 5) {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.MOINS, (Expression<?>) p.get(2));
            }
        });

        ajouterExpression("expression DANS expression~" +
                "expression PAS DANS expression", new Ast<BinComp>(start + 7) {
            @Override
            public BinComp apply(List<Object> p) {
                return new BinComp(
                        (Expression<?>) p.get(0),
                        p.size() == 3 ? BinComp.Comparateur.DANS : BinComp.Comparateur.PAS_DANS,
                        (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression {comparaison} expression", new Ast<BinComp>(start + 8) {
            @Override
            public BinComp apply(List<Object> p) {
                return new BinComp(
                        (Expression<?>) p.get(0),
                        BinComp.Comparateur.valueOf(((Token) p.get(1)).obtenirNom()),
                        (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression {porte_logique} expression~"
                + "{porte_logique} expression", new Ast<BoolOp>(start + 10) {
            @Override
            public BoolOp apply(List<Object> p) {
                if (p.size() == 3) {
                    return new BoolOp(
                            (Expression<?>) p.get(0),
                            BoolOp.Operateur.valueOf(((Token) p.get(1)).obtenirNom()),
                            (Expression<?>) p.get(2));
                } else {
                    return new BoolOp((Expression<?>) p.get(1), BoolOp.Operateur.PAS, null);
                }
            }
        });


        ajouterExpression("expression VIRGULE expression",
                new Ast<CreerListe.Enumeration>() {
                    @Override
                    public CreerListe.Enumeration apply(List<Object> p) {
                        if (p.get(0) instanceof CreerListe.Enumeration) {
                            ((CreerListe.Enumeration) p.get(0)).add((Expression<?>) p.get(2));
                            return (CreerListe.Enumeration) p.get(0);
                        }
                        return new CreerListe.Enumeration((Expression<?>) p.get(0), (Expression<?>) p.get(2));
                    }
                });
        setOrdreExpression();
    }
}

























