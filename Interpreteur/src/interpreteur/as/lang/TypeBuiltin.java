package interpreteur.as.lang;

import interpreteur.ast.buildingBlocs.expressions.Type;

public enum TypeBuiltin {
    tout,
    entier,
    decimal,
    nombre(TypeBuiltin.entier, TypeBuiltin.decimal),
    texte,
    liste,
    dict,
    iterable(TypeBuiltin.texte, TypeBuiltin.liste, TypeBuiltin.dict),
    booleen,
    nulType,
    rien,
    paire,
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

    public Type asType() {
        return new Type(toString());
    }

    /* previous toString
    @Override
    public String toString() {
        return aliases == null ? super.toString() : ArraysUtils.join("|", aliases);
    }
    */
}
