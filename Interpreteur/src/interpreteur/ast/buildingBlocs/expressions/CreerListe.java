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

    @Override
    public String toString() {
        return "CreerListe{" +
                "exprs=" + exprs +
                '}';
    }

    public interface SousSection extends Expression<ASObjet<?>> {
        Expression<?> getExpr();

        class IndexSection implements SousSection {
            private final Expression<?> expr;
            private final Expression<?> idx;

            public IndexSection(Expression<?> expr, Expression<?> idx) {
                this.expr = expr;
                this.idx = idx;
            }

            public Expression<?> getExpr() {
                return expr;
            }

            public int getIdx() {
                return (Integer) idx.eval().getValue();
            }

            @Override
            public ASObjet<?> eval() {
                if (Math.abs(getIdx()) > ((ASObjet.Iterable) this.expr.eval()).taille()) {
                    throw new ASErreur.ErreurIndex("L'index " + getIdx() + " est hors de port\u00E9 (maximum " + (((ASObjet.Iterable) this.expr.eval()).taille() - 1) + ")");
                }
                return ((ASObjet.Iterable) this.expr.eval()).get(getIdx());
            }

            @Override
            public String toString() {
                return "IndexListe{" +
                        "expr=" + expr +
                        ", index=" + idx +
                        '}';
            }
        }

        class CreerSousSection implements SousSection {
            private final Expression<?> expr;
            private final Expression<?> debut;
            private final Expression<?> fin;

            public CreerSousSection(Expression<?> expr, Expression<?> debut, Expression<?> fin) {
                this.expr = expr;
                this.debut = debut;
                this.fin = fin;
            }

            public Expression<?> getExpr() {
                return expr;
            }

            public int getDebut() {
                return this.debut != null ? (Integer) this.debut.eval().getValue() : 0;
            }

            public int getFin() {
                return this.fin != null ?
                        (Integer) this.fin.eval().getValue() :
                        ((ASObjet.Iterable) this.expr.eval()).taille();
            }

            @Override
            public ASObjet<?> eval() {
                return ((ASObjet.Iterable) this.expr.eval()).sousSection(getDebut(), getFin());
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
