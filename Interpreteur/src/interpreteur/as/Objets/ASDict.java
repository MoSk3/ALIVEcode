package interpreteur.as.Objets;

import java.util.Hashtable;

public class ASDict extends Hashtable<ASObjet<?>, ASObjet<?>> implements ASObjet<ASDict> {

    public ASDict() {

    }

    @Override
    public synchronized ASObjet<?> get(Object key) {
        return super.getOrDefault(key, new Nul());
    }

    public Liste getValeurs() {
        return new Liste(values().toArray(ASObjet[]::new));
    }

    public Liste getClefs() {
        return new Liste(keySet().toArray(ASObjet[]::new));
    }

    public Liste getEntrees() {
        return new Liste(entrySet()
                .stream()
                .map(entry -> new Liste(entry.getKey(), entry.getValue()))
                .toArray(Liste[]::new));
    }

    @Override
    public ASDict getValue() {
        return this;
    }

    @Override
    public boolean boolValue() {
        return isEmpty();
    }

    @Override
    public String obtenirNomType() {
        return "dict";
    }
}
