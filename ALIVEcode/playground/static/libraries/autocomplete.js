var patterns = {
    /**
     *? blocks: {
     **   name: [start, end]
     *? }
     */
    symbolPairs: {
        '"': '"',
        "'": "'",
        '(': ')',
        '{': '}',
        '[': ']'
    },
    blocks: {
        // si
        si: ["si", "fin si"],
        // fonctions
        fonction: ["fonction", "fin fonction"],
        // boucles
        faire: ["faire", "tant que"],
        tant_que: ["tant que", "fin tant que"],
        pour: ["pour", "fin pour"],
        repeter: ["repeter", "fin repeter"]
    }
};
var editor;
function addClosingSymbol(openningSymbol, closingSymbol, goBack) {
    if (goBack === void 0) { goBack = true; }
    // TODO si le symbole de fermeture est à la droite du curseur, seulement déplacer le curseur à droite
    editor.commands.exec("insertstring", editor, "" + openningSymbol + closingSymbol);
    return goBack ? { command: "gotoleft", args: { times: 1 } } : {};
}
function autocomplete(data, hashId, keyString, keyCode, e) {
    if (hashId == -1 && keyString in patterns.symbolPairs) {
        return addClosingSymbol(keyString, patterns.symbolPairs[keyString]);
    }
    // TODO add the "fin" block automatically after writing a block
    if (hashId == -1 && keyString === "\n") {
        var prevLine = "";
    }
}
