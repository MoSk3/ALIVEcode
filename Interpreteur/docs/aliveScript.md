## Features AliveScript

#### Commentaires
- simple ligne: <code># *commentaire*</code>
- multiligne:
  - ouverture: `(:`
  - fermeture: `:)`
  - ex: 
    `(:`  
    `salut je suis un commentaire`  
    `sur plusieurs`  
    `lignes`  
    `:)`
- documentation:
  - ouverture: `(-:`
  - fermeture: `:-)`
  - ex:
    ```
    (-:  
    Cette fonction additionne deux nombres et retourne le résultat  
    @param num1: le premier nombre  
    @param num2: le deuxième nombre  
    @retourne la somme deux deux nombres  
    :-)
    fonction additionner(num1: nombre, num2: nombre) -> nombre
      retourner num1 + num2
    fin fonction
    ```


#### i/o 
- output:
  - commande ***`afficher`*** : <code>afficher *valeur*</code>
- input:
  - commande ***`lire dans`*** : <code>lire dans *variable*</code>


#### Variables
- Nom: 
  - commence par une lettre (toutes les lettres unicodes) ou `_`
  - ensuite, autorise les lettres (toutes les lettres unicodes), les `.`, les `_` et les chiffres
  - ex: `nom` `num1` `école` `e_12.ahn1` `additioner_deux_nombres` `test.num3`
- [typage](#typage)

- ##### Getter
  - **LES CONSTANTES NE PEUVENT PAS AVOIR DE GETTER**
  - **UNE VARIABLE NE PEUT PAS AVOIR PLUS D'UN GETTER**
  - syntaxe: 
    - ouverture: <code>get *nom*</code>
    - fermeture: `fin get`
  - utilité:
    > fonction appelée lorsque l'on veut obtenir la valeur d'une variable (par exemple pour l'afficher)
    > La valeur retournée par le get est la valeur obtenu lorsqu'on veut obtenir la valeur de la variable
  - type retour: *le type retourné d'un getter doit être le même que le type de la variable* 
  - ex:
    ```
    get abc
      retourner 3
    fin get

    var abc = 10

    afficher abc # 3
    ```

- ##### Setter
  - **LES CONSTANTES NE PEUVENT PAS AVOIR DE SETTER**
  - **UNE VARIABLE NE PEUT PAS AVOIR PLUS D'UN SETTER**
  - syntaxe: 
    - ouverture:
      - typé: <code>set *nom*(*param*: *type*)</code>
      - pas typé: <code>set *nom*(*param*)</code>
    - fermeture: `fin set`
  - utilité:
    > fonction appelée lorsque l'on assigne une valeur à la variable
    > La valeur retournée par le set est la valeur assignée à la variable
  - type param: *le type du param est* `tout` *s'il n'est pas précisé*
  - type retour: *le type retourné d'un setter doit être le **même** que le type de la variable*
  - ex:
    ```
    set abc(valeur)
      retourner valeur * 2
    fin get

    var abc = 10

    afficher abc # 20

    abc = 2

    afficher abc # 4
    ```

- ##### Déclaration:
  - variable:
    - sans type: <code>var *variable* = *valeur*</code>
    - avec type: <code>var *variable*: *type* = *valeur*</code>
  - constante:
    - sans type: <code>const *variable* = *valeur*</code>
    - avec type: <code>const *variable*: *type* = *valeur*</code>

- ##### Assignement:
  - assignement variable: <code>*variable* = *valeur*</code>
  - assignement constante: <code>**ERREUR: IMPOSSIBLE DE RÉASSIGNER UNE CONSTANTE**</code>
  - assignement variable avec opération arithmétique <code>*variable* **[operation](#arithmétique)**= *valeur*</code>
    - <code>*variable* += *valeur*</code>
    - <code>*variable* -= *valeur*</code>
    - <code>*variable* *= *valeur*</code>
    - <code>*variable* /= *valeur*</code>
    - <code>*variable* %= *valeur*</code>
    - <code>*variable* ^= *valeur*</code>
    - <code>*variable* //= *valeur*</code> 
  - incrément: <code>*variable*++</code>
  - décrément: <code>*variable*--</code>

#### Arithmétique
- addition:         `+`
- soustraction:     `-`
- multiplication:   `*`
- division:         `/`
- division entière: `//`
- exposant:         `^`
- modulo:           `%`


#### Comparaisons
- égal:             `==`
- pas égal:         `!=`
- plus grand:       `>`
- plus petit:       `<`
- plus grand égal:  `>=`
- plus petit égal:  `<=`


#### Opérateurs logiques
- et:   
  - syntaxe: <code>*valeur1* et *valeur2*</code>
  - fonctionnement: retourne <code>*valeur1*</code> si <code>*valeur1*</code> est **faux**, sinon retourne <code>*valeur2*</code>
- ou:   
  - syntaxe: <code>*valeur1* ou *valeur2*</code>
  - fonctionnement: retourne <code>*valeur1*</code> si <code>*valeur1*</code> est **vrai**, sinon retourne <code>*valeur2*</code>
- pas:  
  - syntaxe: <code>pas *valeur*</code>
  - fonctionnement: retourne la valeur booléenne **inverse** de <code>*valeur*</code>


#### Fonction
- syntaxe:
  - ouverture <code>fonction *nom*(*param1*, *param2*, *etc.*)</code>
  - fermeture: `fin fonction`
- paramètres:
  - [typage d'un paramètre paramètre](#Typage)
  - paramètre par défaut: <code>fonction *nom*(*param1* = *valeurParDefaut*)</code>
- retourner:
  - [typage de la valeur retournée par la fonction](#Typage)
  - syntaxe: <code>retourner *valeur*</code>


#### Types

- ##### Typage:
  - variable ou paramètre: <code>*nom*: *type*</code>
  - constante: <code>const *nom*: *type*</code>
  - retour d'une fonction: <code>fonction *nom*() -> *type*</code>
  
- ##### Types builtins:
  - `tout`
  
  - `booleen`: `vrai` **ET** `faux`

  - `nombre`:
    - `entier`: nombre entier entre **-2147483648** et **2147483647**
    - `decimal`: nombre décimal de forme:
      -  <code>*entier*.*entier*</code> **OU**
      -  <code>*entier*.</code> (sous-entend un 0 à la fin) **OU**
      -  <code>.*entier*</code> (sous-entend un 0 au début)
  
  - `iterable`:
    - `texte`: <code>"*texte*"</code> **OU** <code>'*texte*'</code>
    - `liste`: <code>[*valeur1*, *valeur2*, *etc.*]</code>
  
  - `fonctionType` syntaxe: [fonction](#Fonction)
  - `nulType` syntaxe: `nul`
  - `rien` syntaxe: `rien`



#### Iterable (liste | texte)
- ##### index:
  - obtenir valeur à l'index: <code>*variable*\[*index*]</code>
  - assigner valeur à l'index: <code>*variable*\[*index*] = *valeur*</code>
  
- ##### ranges:
  - obtenir valeurs dans le range: <code>*variable*\[*debut*:*fin*]</code>
  - assigner valeurs dans le range: <code>*variable*\[*debut*:*fin*] = *valeurIterable*</code>
  
- ##### suites: 
  - syntaxe: <code>[*debut* ... *fin*]</code> **OU** <code>[*debut* ... *fin* bond *valeurEntier*]</code>
  - nombre
    - ex: 
      - `[1 ... 7] == [1, 2, 3, 4, 5, 6, 7]`
      - `[1 ... 7 bond 2] == [1, 3, 5, 7]`
  - lettres
    - ex:
      - `['e' ... 'm'] == ['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']`
      - `['L' ... 'E' bond -1] == ["L", "K", "J", "I", "H", "G", "F", "E"]`
  
- ##### opérateurs `dans` **ET** `pas dans`
  - ex: <code>si *variable* dans *valeurIterable*</code>
  - ex: <code>si *variable* pas dans *valeurIterable*</code>


#### Control flow
- si: <code>si *condition*</code>
- sinon: `sinon`
- fermeture: `fin si`


#### Boucles
- ##### types:
  - repeter: 
    - ouverture: <code>repeter *valeurEntier*</code>
    - fermeture: `fin repeter`

  - tant que:
    - ouverture: <code>tant que *condition*</code>
    - fermeture: `fin tant que`
  
  - faire ... tant que
    - ouverture: `faire`
    - fermeture: <code>tant que *condition*</code>
  
  - pour
    - ouverture: 
      - La variable itérée existe déjà:
        - <code>pour *variable* dans *valeurIterable*</code>
      - La variable itérée n'existe pas: 
        - <code>pour var *variable* dans *valeurIterable*</code>
      - La variable itérée n'existe pas **ET** c'est une constante: 
        - <code>pour const *variable* dans *valeurIterable*</code>
    - fermeture: `fin pour`

- ##### control flow
  - `sortir`        (break en java/python)
  - `continuer`     (continue en java/python)






#### Modules
- syntaxe: 
  - utiliser le module au complet: <code>utiliser *nomModule*</code>
  - utiliser seulement certaines fonctions/constantes du module: <code>utiliser *nomModule* {*nomFonction1*, *nomConstante1*, *etc.*}</code>
- ##### Modules builtins:
  - builtins (n'a pas besoin d'être `utiliser`, car il est utilisé par défaut):
    - fonctions:
      - ~~info~~
      
      - aleatoire(choix: iterable) -> tout
      - typeDe(element: tout) -> texte
      
      - sep(txt: texte) -> liste
      - joindre(lst: liste, separateur: texte = " ") -> texte
      - inverser(iter: iterable) -> iterable
      - map(f: fonctionType, lst: liste) -> liste
      - filtrer(f: fonctionType, lst: liste) -> liste
      - somme(lst: liste) -> nombre
      - max(lst: liste) -> nombre
      - min(lst: liste) -> nombre
      - unir(lst1: liste, lst2: liste) -> liste
      - tailleDe(iter: iterable) -> entier
      
      - bin(nb: entier) -> texte
      - maj(txt: texte) -> texte
      - minus(txt: texte) -> texte
      - estNumerique(txt: texte) -> booleen
      - format(txt: texte, valeurs: liste) -> texte
      - remplacer(txt: texte, pattern: texte, remplacement: texte) -> texte
      - remplacerRe(txt: texte, pattern: texte, remplacement: texte) -> texte
      - match(txt: texte, pattern: texte) -> booleen
      
      - texte(element: tout) -> texte
      - entier(txt: texte, base: entier = 10) -> entier
      - nombre(txt: texte) -> nombre
      - decimal(txt: texte) -> decimal
      - booleen(element: tout) -> booleen
    - constantes:
      - **AUCUNE**

  - Math:
    - fonctions:
      - sin(x: nombre) -> decimal
      - cos(x: nombre) -> decimal
      - tan(x: nombre) -> decimal
      - arrondir(n: nombre, nbSignificatifs: entier) -> nombre
      - abs(x: nombre) -> nombre
    - constantes:
      - PI = 3.141592653589793
      - E = 2.718281828459045


## Versioning
> Légende:
> - *italique* = nombre

#### Alpha (a)
- Utilisé pour désigner une version du langage où les nouvelles fonctionnalités sont en train d'être implémentéees (hautement instable)
- v*Majeur*.*Mineur*-a.*Version*
- ex: v1.2-a.3

#### Béta (b)
- Utilisé pour désigner une version du langage possédant toutes les nouvelles fonctionnalités de la nouvelle version (instable)
- v*Majeur*.*Mineur*-b.*Version*
- ex: v1.1-b.0

#### Release candidate (rc)
- Utilisé pour désigner une version *suffisamment* stable du langage, mais qui doit encore être rigoureusement testée avant d'être utilisée en production (stable)
- v*Majeur*.*Mineur*-rc.*Version*
- ex: v1.4-rc.1

#### Version finale
- Utilisé pour désigner une version finale du langage pouvant être utilisée en production (hautement stable)
- v*Majeur*.*Mineur*.*Patch*
- ex: v1.5.2


