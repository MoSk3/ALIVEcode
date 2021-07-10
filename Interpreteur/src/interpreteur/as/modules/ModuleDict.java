package interpreteur.as.modules;

import interpreteur.as.Objets.ASFonction;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.expressions.Type;

public class ModuleDict extends ASModule {

    ASFonction creer = new ASFonction("creer", new ASObjet.Fonction.Parametre[]{

    }, Type.TypeBuiltin.fonctionType.asType()) {

    };

    public static void charger() {
        ajouterModule("Dict", new ASObjet.Fonction[]{

            new ASObjet.Fonction("creer", new ASObjet.Fonction.Parametre[]{

            }, Type.TypeBuiltin.fonctionType.asType()) {
                @Override
                public ASObjet<?> executer() {
                    return null;
                }
            }
        });
    }
}
