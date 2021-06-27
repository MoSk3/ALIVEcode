package interpreteur.ast.buildingBlocs.expressions;

import interpreteur.as.Objets.Scope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.utils.ArraysUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class Type implements Expression<ASObjet<?>> {

    private String nom;

    public Type(String nom) {
        this.nom = nom
                .replace("nombre", "entier|decimal")
                .replace("iterable", "texte|liste");
    }

    public String nom() {
        return this.nom;
    }

    public String getNom() {
        return nom.equals("tout") ? null : nom;
    }

    public List<String> getNomAsList() {
        return this.getNom() == null ? null : Arrays.asList(this.getNom().split("\\|"));
    }

    public void union(Type type) {
        if (type.getNom() == null)
            this.nom = "tout";
        else if (this.noMatch(type)) {
            this.nom += "|" + type.nom;
        }
    }

    public void union(String type) {
        if (type.equals("tout"))
            this.nom = "tout";
        else if (this.noMatch(type))
            this.nom += "|" + type
                    .replace("nombre", "entier|decimal")
                    .replace("iterable", "texte|liste");
    }

    public boolean noMatch(Object o) {
        if (this == o) return false;

        if (o instanceof String) {
            List<String> type = Arrays.asList(((String) o).split("\\|"));
            return this.getNom() != null && !type.contains("tout") && this.getNomAsList().stream().noneMatch(type::contains);
        } else if (o instanceof Type) {
            List<String> type = ((Type) o).getNomAsList();
            return this.getNom() != null && type != null && this.getNomAsList().stream().noneMatch(type::contains);

        } else return true;
    }

    public boolean match(Object o) {
        return !noMatch(o);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nom);
    }

    @Override
    public ASObjet<?> eval() {
        ASObjet.Variable var;
        if ((var = Scope.getCurrentScopeInstance().getVariable(this.nom)) != null) {
            return var.getValeurApresGetter();
        }
        throw new ASErreur.ErreurType("Il est impossible d'\u00E9valuer le type '" + this.nom + "'");
    }

    @Override
    public String toString() {
        return "Type{" +
                "nom=" + nom +
                '}';
    }

    enum TypeBuiltin {
        tout,
        entier,
        decimal,
        nombre(TypeBuiltin.entier, TypeBuiltin.decimal),
        texte,
        liste,
        iterable(TypeBuiltin.texte, TypeBuiltin.liste),
        booleen,
        nulType,
        fonctionType;

        private final TypeBuiltin[] aliases;

        TypeBuiltin() {
            this.aliases = null;
        }

        TypeBuiltin(TypeBuiltin... alias) {
            this.aliases = alias;
        }

        public TypeBuiltin[] getAliases() {
            return aliases;
        }

        @Override
        public String toString() {
            return aliases == null ? super.toString() : ArraysUtils.join("|", aliases);
        }
    }


}
