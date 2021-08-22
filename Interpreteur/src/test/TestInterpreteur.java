package test;

import java.util.stream.Stream;

public class TestInterpreteur {

    private static boolean test() {
        return Stream.of(
                //programme vide
                new Test()
                        .expect("")
                        .toEnd(),

                // commentaires
                new Test()
                        .expect("""
                                # ceci est un commentaire
                                """)
                        .and("""
                                (:
                                salut je suis un commentaire
                                sur plusieurs
                                lignes
                                :)
                                """
                        )
                        .and("""
                                (-:
                                 - Cette fonction additionne deux nombres et retourne le résultat
                                 - @param num1: le premier nombre
                                 - @param num2: le deuxième nombre
                                 - @retourne la somme deux deux nombres
                                :-)
                                """
                        )
                        .toEnd(),

                // variables
                new Test()
                        .expect("""
                                var a <- 23
                                afficher a
                                """
                        )
                        .and("""
                                var a = 23
                                afficher a
                                """
                        )
                        .toPrint("23")
                        .toEnd()

        ).allMatch(Test::passTest);
    }

    public static void main(String[] args) {
        System.out.println("Final result: " + (TestInterpreteur.test() ? "Success!" : "Failure"));
    }
}
