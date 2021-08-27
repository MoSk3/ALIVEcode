package test.generateurs;

import interpreteur.as.ASLexer;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class AstGeneratorTest {

    private static ASLexer lexer;

    @BeforeAll
    static void setup() {
        lexer = new ASLexer();
    }

    @Test
    void hasSafeSyntax() {
    }

    @ParameterizedTest
    @ValueSource(strings = {})
    void evalOneExpr() {
    }

    @Test
    void eval() {
    }

    @Test
    void memeStructureProgramme() {
    }

    @Test
    void memeStructureExpression() {
    }

    @Test
    void ajouterProgramme() {
    }

    @Test
    void ajouterExpression() {
    }

    @Test
    void parse() {
    }

    @Test
    void obtenirProgramme() {
    }
}