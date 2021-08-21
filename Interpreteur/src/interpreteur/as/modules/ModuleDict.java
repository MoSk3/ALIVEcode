package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.executeur.Executeur;

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

    public ModuleDict(ASModuleManager moduleManager) {
        super(moduleManager);
    }

    //ASFonction creer = new ASFonction("creer", ASObjet.TypeBuiltin.fonctionType.asType()) {
    //    @Override
    //    public FonctionInstance makeInstance() {
    //        return makeJavaInstance((paramsValeur) -> {
//
    //            return null;
    //        });
    //    }
    //};

    public void charger() {
        moduleManager.ajouterModule("Dict", new ASObjet.Fonction[]{

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
