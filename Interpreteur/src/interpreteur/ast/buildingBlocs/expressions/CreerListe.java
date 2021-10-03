package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.ast.buildingBlocs.Expression;

import java.util.ArrayList;
import java.util.Arrays;


public class CreerListe implements Expression<ASObjet.Liste> {

    private final ArrayList<Expression<?>> exprs;

    public CreerListe(Expression<?>... exprs) {
        this.exprs = new ArrayList<>(Arrays.asList(exprs));
    }

    @Override
    public ASObjet.Liste eval() {
        return new ASObjet.Liste(exprs.stream().map(Expression::eval).toArray(ASObjet[]::new));
    }

    public ArrayList<Expression<?>> getExprs() {
        return exprs;
    }

    @Override
    public String toString() {
        return "CreerListe{" +
                "exprs=" + exprs +
                '}';
    }

    public interface SousSection extends Expression<ASObjet<?>> {
        Expression<?> getExpr();

        record IndexSection(Expression<?> expr,
                            Expression<?> idx) implements SousSection {

            public Expression<?> getExpr() {
                return expr;
            }

            public int getIdx() {
                Object valueIdx = this.idx.eval().getValue();
                if (!(valueIdx instanceof Integer idx)) {
                    throw new ASErreur.ErreurIndex("Un index doit \u00EAtre un nombre entier");
                }
                return idx;
            }

            @Override
            public ASObjet<?> eval() {
                ASObjet<?> evalExpr = this.expr.eval();
                if (!(evalExpr instanceof ASObjet.Iterable)) {
                    throw new ASErreur.ErreurType("L'op\u00E9ration d'index n'est pas d\u00E9finie pour " +
                            "un \u00E9l\u00E9ment de type '" + evalExpr.obtenirNomType() + "'.");
                }
                int idx = getIdx();
                if (Math.abs(idx < 0 ? idx + 1 : idx) >= ((ASObjet.Iterable) evalExpr).taille()) {
                    int bound = (((ASObjet.Iterable) evalExpr).taille() - 1);
                    throw new ASErreur.ErreurIndex("L'index " + idx + " est hors de port\u00E9 (entre " + -(bound + 1) + " et " + bound + ")");
                }
                return ((ASObjet.Iterable) evalExpr).get(idx);
            }

            @Override
            public String toString() {
                return "IndexListe{" +
                        "expr=" + expr +
                        ", index=" + idx +
                        '}';
            }
        }

        record CreerSousSection(Expression<?> expr,
                                Expression<?> debut,
                                Expression<?> fin) implements SousSection {

            public Expression<?> getExpr() {
                return expr;
            }

            public int getDebut() {
                if (debut == null) return 0;

                Object valueDebut = debut.eval().getValue();
                if (!(valueDebut instanceof Integer)) {
                    throw new ASErreur.ErreurIndex("Une balise de d\u00E9but doit \u00EAtre un nombre entier");
                }
                return (Integer) valueDebut;
            }

            public int getFin() {
                if (fin == null) return ((ASObjet.Iterable) this.expr.eval()).taille();

                Object valueFin = fin.eval().getValue();

                if (!(valueFin instanceof Integer)) {
                    throw new ASErreur.ErreurIndex("Une balise de fin doit \u00EAtre un nombre entier");
                }
                return (Integer) valueFin;
            }

            @Override
            public ASObjet<?> eval() {
                ASObjet<?> evalExpr = this.expr.eval();
                if (!(evalExpr instanceof ASObjet.Iterable)) {
                    throw new ASErreur.ErreurType("L'op\u00E9ration de coupe n'est pas d\u00E9finie pour " +
                            "un \u00E9l\u00E9ment de type '" + evalExpr.obtenirNomType() + "'.");
                }
                return ((ASObjet.Iterable) evalExpr).sousSection(getDebut(), getFin());
            }

            @Override
            public String toString() {
                return "CreerSousListe{" +
                        "expr=" + expr +
                        ", debut=" + debut +
                        ", fin=" + fin +
                        '}';
            }
        }
    }


    public static class Enumeration implements Expression<ASObjet<?>> {
        private final ArrayList<Expression<?>> exprs;

        public Enumeration(Expression<?>... exprs) {
            this.exprs = new ArrayList<>(Arrays.asList(exprs));
        }

        public void add(Expression<?> expr) {
            this.exprs.add(expr);
        }

        public ArrayList<Expression<?>> getExprs() {
            return exprs;
        }

        public CreerListe build() {
            return new CreerListe(exprs.toArray(Expression[]::new));
        }

        @Override
        public String toString() {
            return "Enumeration{" +
                    "exprs=" + exprs +
                    '}';
        }

        @Override
        public ASObjet<?> eval() {
            throw new ASErreur.ErreurSyntaxe("Syntaxe invalide. Est-ce qu'il manquerait un { au d\u00E9but et un } \u00E0 la fin de la liste?");
        }
    }
}
