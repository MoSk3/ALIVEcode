var editor = ace.edit("line-interface");
editor.setTheme("ace/theme/monokai-blue");
editor.session.setMode("ace/mode/simplifie");
editor.setOptions({
    fontSize: "15pt",
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
});