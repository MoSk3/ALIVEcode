var editor;
var checkComment = ":";
var patterns = {
    commentaires: [
        { open: "(:", close: ":)" },
        { open: "(-:", close: ":-)" },
    ],
    /**
     *? blocks: {
     **   name: [start, end]
     *? }
     */
    symbolPairs: [
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '(', close: ')' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
    ],
    blocks: [
        // si
        { open: "si", close: "fin si" },
        // fonctions
        { open: "fonction", close: "fin fonction" },
        //getter
        { open: "get", close: "fin get" },
        //setter
        { open: "set", close: "fin set" },
        // structures
        { open: "structure", close: "fin structure" },
        // boucles
        { open: "faire", close: "tant que" },
        { open: "tant que", close: "fin tant que" },
        { open: "pour", close: "fin pour" },
        { open: "repeter", close: "fin repeter" },
    ]
};
function closeSymbolPair(symbol, keyString, goBackTimes) {
    var _a, _b;
    if (goBackTimes === void 0) { goBackTimes = 1; }
    var pos = getPos();
    var line = getLine(pos.row);
    if (line[pos.column] === symbol.close && keyString === symbol.close) {
        return { command: "gotoright", args: { times: 1 } };
    }
    // doesn't add the pair if the symbol is placed before a word or an opening symbol
    else if (
    // does nothing if the symbol is added before or after a letter or the opening symbol
    ((_a = line[pos.column]) === null || _a === void 0 ? void 0 : _a.match(/\p{L}+|\d+/u))
        || line[pos.column] === symbol.open
        || (((_b = line[pos.column - 1]) === null || _b === void 0 ? void 0 : _b.match(/\p{L}+/u)) && symbol.close === symbol.open)
        // does nothing if the symbole typed is the closing symbol and the closing symbol is not the same as the opening symbol
        || (keyString === symbol.close && symbol.close !== symbol.open)
        // return before adding the pair if the symbol is the closing symbol
        || (symbol.close === symbol.open && line[pos.column - 1] === symbol.open)) {
        return;
    }
    execCommands({ command: "insertstring", args: "" + symbol.open + symbol.close });
    return { command: "gotoleft", args: { times: goBackTimes } };
}
function closeBlock() {
    var pos = getPos();
    var currentLine = getLine(pos.row);
    if (!currentLine)
        return;
    var blockPairs = Object.values(patterns.blocks);
    var blockPair = blockPairs.find(function (blockPair) { return lineStartWith(currentLine, blockPair.open); });
    if (!blockPair)
        return;
    var tabSize = editor.session.$tabSize;
    var spaces = indentation(currentLine);
    //* check if the block has already been closed
    for (var _i = 0, _a = getLines(pos.row + 1) || []; _i < _a.length; _i++) {
        var line = _a[_i];
        // the line checked must have the same indentation to be a potential closing statement
        if (line.length - line.trimLeft().length === spaces) {
            // if a new block of the same type is open before the current block is close, the current block must be closed
            if (lineStartWith(line, blockPair.open)) {
                break;
            }
            // if a closing statement of the good type is found, there is no need to add another one
            else if (lineStartWith(line, blockPair.close)) {
                return { command: "insertstring", args: "\n" + " ".repeat(spaces + tabSize) };
            }
        }
    }
    execCommands({ command: "insertstring", args: "\n\n" + " ".repeat(spaces) + blockPair.close }, { command: "golineup", args: { times: 1 } });
    return { command: "insertstring", args: " ".repeat(spaces + tabSize) };
}
function autocomplete(data, hashId, keyString, keyCode, e) {
    var pos = getPos();
    var line = getLine(pos.row);
    if (hashId == -1) {
        var symbolPair = Object.values(patterns.symbolPairs).find(function (symbol) { return symbol.open === keyString || symbol.close === keyString; });
        if (symbolPair != undefined) {
            return closeSymbolPair(symbolPair, keyString);
        }
        // les commentaires fermant automatique
        else if (keyString === checkComment) {
            var _a = patterns.commentaires, multiligne = _a[0], documentation = _a[1];
            var lastSymbol = ")";
            if (line.substring(pos.column - (multiligne.open.length - 1), pos.column) + ":" === multiligne.open) {
                var closing = multiligne.close;
                // if the line already has the last symbol of the comment at the end, don't add it
                if (line[pos.column] === lastSymbol)
                    closing = closing.substring(0, closing.length - 1);
                execCommands({ command: "insertstring", args: ":\n " + indentedString(line) + "\n" + indentedString(line, closing) }, { command: "golineup", args: { times: 1 } });
                return { command: "gotolineend" };
            }
            else if (line.substring(pos.column - (documentation.open.length - 1), pos.column) + ":" === documentation.open) {
                var closing = documentation.close;
                // if the line already has the last symbol of the comment at the end, don't add it
                if (line[pos.column] === lastSymbol)
                    closing = closing.substring(0, closing.length - 1);
                execCommands({ command: "insertstring", args: ":\n " + indentedString(line) + "- \n" + indentedString(line, closing) }, { command: "golineup", args: { times: 1 } });
                return { command: "gotolineend" };
            }
        }
        // if the \n is pressed at the end of the line
        if (keyString === "\n" && line.trim() && pos.column >= line.trimRight().length) {
            if (lineStartWith(line, "-")) {
                return { command: "insertstring", args: "\n" + indentedString(line) + "- " };
            }
            return closeBlock();
        }
    }
}
//#region utils
function execCommands() {
    var commands = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        commands[_i] = arguments[_i];
    }
    for (var _a = 0, commands_1 = commands; _a < commands_1.length; _a++) {
        var command = commands_1[_a];
        editor.commands.exec(command.command, editor, command.args);
    }
}
function insertIndentedString(line, text) {
    return { command: "insertstring", args: "" + " ".repeat(indentation(line)) + text };
}
/**
 * @returns the current position of the cursor as an object of form
 * `{ row: number, column: number }`
 */
function getPos() {
    return editor.getCursorPosition();
}
/**
 * get the line at the specified row
 * @param row the index of the line
 * @returns the line at the specified row or `undefined` if there is none
 */
function getLine(row) {
    return editor.session.getLine(row);
}
/**
 * get the lines from one row to another row
 * @param start the first row included in the array
 * @param end the last row included in the array (default is the last row of the document)
 * @returns the array of lines between the start row and the end row
 */
function getLines(start, end) {
    if (end === void 0) { end = null; }
    return editor.session.getLines(start, end !== null && end !== void 0 ? end : editor.session.getLength());
}
/**
 * check if the line startswith a specify string and ignores the indentation at the start of the line
 * @param line the line to be tested
 * @param start the string
 * @returns if the line starts with start
 */
function lineStartWith(line, start) {
    return line.trimLeft().startsWith(start);
}
/**
 *
 * @param line
 * @returns the number of spaces that make the indentation of the line
 */
function indentation(line) {
    var tabSize = editor.session.$tabSize;
    return line.substring(0, line.indexOf(line.trimLeft()[0])).replace("\t", " ".repeat(tabSize)).length;
}
function indentedString(line, text) {
    if (text === void 0) { text = ""; }
    return "" + " ".repeat(indentation(line)) + text;
}
//#endregion
