package interpreteur.analyste;

import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;

import java.lang.reflect.Field;

public class Analyste {

    private static class JSClass {
        private final String nom, pattern;

        JSClass(String nom, String pattern) {
            this.nom = nom;
            this.pattern = pattern;
        }

        public String getNom() {
            return nom;
        }

        public String getPattern() {
            return pattern;
        }
    }



    public static String analyzeProgramme(Class<? extends Programme> progClass) {

        String code = progClass.getCanonicalName();



        for (Field argument : progClass.getFields()) {

        }

        return null;
    }

    public static String analyzeExpression(Class<? extends Expression<?>> progClass) {

        String code = progClass.getCanonicalName();



        for (Field argument : progClass.getFields()) {

        }

        return null;
    }


}
