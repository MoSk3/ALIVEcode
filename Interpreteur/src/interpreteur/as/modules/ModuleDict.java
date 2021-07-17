package interpreteur.as.modules;

import interpreteur.as.Objets.ASFonction;
import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.expressions.Type;

public class ModuleDict extends ASModule {

    String dictCode = """
            fonction Dict.creer() -> fonctionType
                var clefs = {}
                var valeurs = {}
                fonction dict(clef: texte, valeur: tout = nul) -> tout
                    si clef dans clefs
                        var idx = indexDe(clef, clefs)
                        si valeur != nul
                            valeurs[idx] = valeur
                            retourner valeur
                        sinon
                            retourner valeurs[idx]
                        fin si
                    sinon
                        si valeur != nul
                            clefs += clef
                            valeurs += valeur
                            retourner {clef, valeur}
                        sinon
                            retourner nul
                        fin si
                    fin si
                fin fonction
                retourner dict
            fin fonction
            """;

    ASFonction creer = new ASFonction("creer", ASObjet.TypeBuiltin.fonctionType.asType()) {
        @Override
        public FonctionInstance makeInstance() {
            return makeJavaInstance((paramsValeur) -> {

                return null;
            });
        }
    };

    public static void charger() {
        ajouterModule("Dict", new ASObjet.Fonction[]{

                new ASObjet.Fonction("creer", new ASObjet.Fonction.Parametre[]{

                }, ASObjet.TypeBuiltin.fonctionType.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return null;
                    }
                }
        });
    }
}
