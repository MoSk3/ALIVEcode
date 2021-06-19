var cmd = $("#cmd");
var editor;
var make_safe = function (msg) { return msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
function print_console(msg) {
    var today = new Date();
    var heures = today.getHours() >= 10 ? today.getHours() : '0' + today.getHours();
    var minutes = today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes();
    var secondes = today.getSeconds() >= 10 ? today.getSeconds() : '0' + today.getSeconds();
    msg = make_safe(msg);
    //cmd.append(`<span><u><i>${heures}:${minutes}:${secondes}:</i></u> ${msg}</span><br>`)
    cmd.append("<span>" + msg + "</span><br>");
    cmd[0].scrollTop = cmd[0].scrollHeight;
}
function print_error(msg, line) {
    var today = new Date();
    var heures = today.getHours() >= 10 ? today.getHours() : '0' + today.getHours();
    var minutes = today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes();
    var secondes = today.getSeconds() >= 10 ? today.getSeconds() : '0' + today.getSeconds();
    msg = make_safe(msg);
    var errorName = msg.split(":", 1)[0];
    var errorMsg = msg.substr(msg.indexOf(":") + 1);
    //cmd.append(`<span style="color: red"><u><i>${heures}:${minutes}:${secondes}:</i></u> ${errorName}</span> à la ligne <strong>#${line} :<br></strong>"${msg}"<br>`)
    var errorTitle = linkToLine("<u>" + errorName + " \u00E0 la ligne #" + line + "</u>", line);
    cmd.append("<span style=\"color: red\">\n            " + errorTitle + ":\n        </span>\n        <br>\n        \u2192 " + errorMsg + "\n        <br>");
    cmd[0].scrollTop = cmd[0].scrollHeight;
}
function linkToLine(text, line) {
    return "<a>\n            <span onclick=\"editor.gotoLine(" + line + "); editor.selection.selectLine()\">\n                    " + text + "\n            </span>\n            </a>";
}
function print_end(interrupted) {
}
function clear_cmd() {
    cmd.text('');
}
