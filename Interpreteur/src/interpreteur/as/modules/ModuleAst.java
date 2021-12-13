package interpreteur.as.modules;

import interpreteur.as.objets.ASObjet;
import interpreteur.as.objets.FonctionModule;
import interpreteur.as.objets.Parametre;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;

public class ModuleAst {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new FonctionModule[]{
            new FonctionModule("genererArbre", new Parametre[] {
                    new Parametre(new Type("texte"), "param", null)
            }, new Type("texte")) {
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
