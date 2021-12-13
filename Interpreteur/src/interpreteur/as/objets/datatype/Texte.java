package interpreteur.as.objets.datatype;

import interpreteur.as.objets.ASObjet;
import interpreteur.as.objets.TypeBuiltin;
import interpreteur.tokens.Token;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Objects;

public class Texte implements Iterable<String> {
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
        if (element.getValue() instanceof String s) {
            return this.valeur.contains(s);
        } else {
            return false;
        }
    }

    @Override
    public Iterable<String> sousSection(int debut, int fin) {
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
        return TypeBuiltin.texte.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Texte texte)) return false;
        return Objects.equals(valeur, texte.valeur);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valeur);
    }
}
