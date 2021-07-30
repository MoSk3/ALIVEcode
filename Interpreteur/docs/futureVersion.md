# Futures versions d'aliveScript

### Version 4
- opérateur

### Version 3
- Types personnalisés
- Objets ?
- Classes ?

- Text blocks (avec `"""`)
  - Comme des strings, mais l'indentation est préservée

- Système de gestion des erreurs
    - ajouter un mot clef pour lancer des erreurs
    - ajouter une façon d'attraper les erreurs


- changements dans `afficher`
    - styliser l'output pour changer la couleur, mettre le texte en italique, en gras, etc.



### Version 2

- changement dans les fonctions
  - opérateur ... pour ajouter un nombre x de paramètres (spread operator en js)
  - ex:
    ```python
    fonction abc(param1, ...autres)
        afficher typeDe(autres) # liste
    fin fonction
    ```

- nouveau mot clef `inclure`
    - permet d'accéder à du code situé dans d'autres fichiers 
    

- changements dans `afficher`
    - ajout des escapes characters
        1. \n -> nouvelle ligne
        2. \b -> backspace
        3. \t -> tab
        4. \r -> carriage return
        5. \\\\ -> \\
    

- changement dans precompiler
    - permettre d'écrire tout ce qui commence par `{`, `[`, `(` ou `,`
    sur plusieurs lignes (ex: les listes, les déclarations/appels de fonctions, les index, etc.)
    - ex:  
    lst = { 1,  
    2,  
    3,  
    4 }


- changements dans `lire`
    - <s>Permettre d'afficher un message custom dans la console demandant un input</s>
    - Permettre de preciser le type lu (optionnel, par défaut `texte`)
        - syntaxe actuelle: lire dans `var`
        - syntaxe ajoutée: lire `type` dans `var`   
        - ex:  
        lire entier dans var  
        afficher typeDe(var)  # entier
    - _renommer `lire` pour `ecrire` ou `noter`_??
        - ex:  
        ecrire dans var  
        ecrire entier dans var  
        **_OU_**  
        noter dans var  
        noter booleen dans var


- changements à `utiliser`
    - Permettre de changer le nom d'un module utilisé grâce à un alias
        - syntaxe: utiliser `nomModule` alias `nouveauNom`
        - ex:   
        utiliser Voiture alias Vo  
        Vo.vitesse = 255
    - symbole * comme alias pour tout utiliser sans avoir à préciser le module
        - syntaxe: utiliser `nomModule` alias \*
        - ex:   
        utiliser Voiture alias \*  
        vitesse = 255

- documentation dans les fonctions avec  
  `(-:`  
  `documentation`  
  `:-)`

















