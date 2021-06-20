package interpreteur.ast.buildingBlocs.programmes;

import interpreteur.as.modules.ASModule;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.Var;

import javax.lang.model.type.NullType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


public class Utiliser extends Programme {
    private final Var module;
    private final List<Var> sous_modules;

    public Utiliser(Var module, Var[] sous_modules) {
        this.module = module;
        this.sous_modules = Arrays.asList(sous_modules);
    }

    public Utiliser(Var module) {
        this.module = module;
        this.sous_modules = new ArrayList<>();
    }

    @Override
    public NullType execute() {
        if (sous_modules.isEmpty()) {
            ASModule.utiliserModule(module.getNom());
        } else {
            ASModule.utiliserModule(module.getNom(), sous_modules.stream().map(Var::getNom).toArray(String[]::new));
        }
        return null;
    }

    @Override
    public String toString() {
        return "Utiliser{" +
                "module=" + module +
                ", sous_modules?=" + sous_modules +
                '}';
    }
}
