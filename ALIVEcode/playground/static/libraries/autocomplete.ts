type commandNames =
    "showSettingsMenu" | "goToNextError" | "goToPreviousError" | "selectall" | "centerselection" | "gotoline" | "fold" | "unfold" | "toggleFoldWidget"
    | "toggleParentFoldWidget" | "foldall" | "foldAllComments" | "foldOther" | "unfoldall" | "findnext" | "findprevious" | "selectOrFindNext"
    | "selectOrFindPrevious" | "find" | "overwrite" | "selecttostart" | "gotostart" | "selectup" | "golineup" | "selecttoend" | "gotoend"
    | "selectdown" | "golinedown" | "selectwordleft" | "gotowordleft" | "selecttolinestart" | "gotolinestart" | "selectleft" | "gotoleft" | "selectwordright"
    | "gotowordright" | "selecttolineend" | "gotolineend" | "selectright" | "gotoright" | "selectpagedown" | "pagedown" | "gotopagedown"
    | "selectpageup" | "pageup" | "gotopageup" | "scrollup" | "scrolldown" | "selectlinestart" | "selectlineend" | "togglerecording"
    | "replaymacro" | "jumptomatching" | "selecttomatching" | "expandToMatching" | "passKeysToBrowser" | "copy" | "cut" | "paste" | "removeline"
    | "duplicateSelection" | "sortlines" | "togglecomment" | "toggleBlockComment" | "modifyNumberUp" | "modifyNumberDown" | "replace" | "undo" | "redo"
    | "copylinesup" | "movelinesup" | "copylinesdown" | "movelinesdown" | "del" | "backspace" | "cut_or_delete" | "removetolinestart" | "removetolineend"
    | "removetolinestarthard" | "removetolineendhard" | "removewordleft" | "removewordright" | "outdent" | "indent" | "blockoutdent" | "blockindent"
    | "insertstring" | "inserttext" | "splitline" | "transposeletters" | "touppercase" | "tolowercase" | "autoindent" | "expandtoline" | "joinlines"
    | "invertSelection" | "addLineAfter" | "addLineBefore" | "openCommandPallete" | "modeSelect" | "foldToLevel1" | "foldToLevel2" | "foldToLevel3"
    | "foldToLevel4" | "foldToLevel5" | "foldToLevel6" | "foldToLevel7" | "foldToLevel8" | "addCursorAbove" | "addCursorBelow" | "addCursorAboveSkipCurrent"
    | "addCursorBelowSkipCurrent" | "selectMoreBefore" | "selectMoreAfter" | "selectNextBefore" | "selectNextAfter" | "toggleSplitSelectionIntoLines"
    | "splitSelectionIntoLines" | "alignCursors" | "findAll" | "startAutocomplete" | "expandSnippet"

    
const patterns = {

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
}

type command_args = number /* line */ | string /* str */ | { times: number, text?: string } /* args */

type command = {
    command: commandNames
    args: command_args
}

function execCommands(...commands: command[]) {
    for (const command of commands) {
        editor.commands.exec(command.command, editor, command.args)
    }
}


let editor: any;
function addClosingSymbol(openningSymbol: string, closingSymbol: string, goBackTimes: number = 1) {
    // TODO si le symbole de fermeture est à la droite du curseur, seulement déplacer le curseur à droite
    execCommands(
        { command: "insertstring", args: `${openningSymbol}${closingSymbol}` },
        { command: "gotoleft", args: { times: goBackTimes } }
    );
}

function autocomplete(data: any, hashId: number, keyString: string, keyCode: number, e: unknown) {
    if (hashId == -1 && keyString in patterns.symbolPairs) {
        addClosingSymbol(keyString, patterns.symbolPairs[keyString])
    }

    // TODO add the "fin" block automatically after writing a block
    if (hashId == -1 && keyString === "\n") {
        const prevLine = "";

    }
}

