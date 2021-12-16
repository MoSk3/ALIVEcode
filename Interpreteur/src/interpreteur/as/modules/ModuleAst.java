package interpreteur.as.modules;

import interpreteur.as.modules.core.ASModule;
import interpreteur.as.lang.ASObjet;
import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASParametre;
import interpreteur.as.lang.ASType;
import interpreteur.executeur.Executeur;

public class ModuleAst {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASFonctionModule[]{
            new ASFonctionModule("genererArbre", new ASType("texte"), new ASParametre[] {
                    new ASParametre(new ASType("texte"), "param", null)
            }) {
                @Override
                public ASObjet<?> executer() {
                    //List<Token> a = Executeur.getLexer().lex((String) this.getValeurParam("param").getValue());
                    //return new Texte(Executeur.getAst().parse(a).toString());
                    return null;
                }
            }
        });
    }
}
