const cmd = $("#cmd");
let editor;

const make_safe = (msg: string) => msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function print_console(msg: string) {
    let today = new Date()
    let heures = today.getHours() >= 10 ? today.getHours() : '0' + today.getHours()
    let minutes = today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes()
    let secondes = today.getSeconds() >= 10 ? today.getSeconds() : '0' + today.getSeconds()
    msg = make_safe(msg);
    //cmd.append(`<span><u><i>${heures}:${minutes}:${secondes}:</i></u> ${msg}</span><br>`)
    cmd.append(`<span>${msg}</span><br>`)
    cmd[0].scrollTop = cmd[0].scrollHeight
}

function print_error(msg: string, line: number) {
    let today = new Date()
    let heures = today.getHours() >= 10 ? today.getHours() : '0' + today.getHours()
    let minutes = today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes()
    let secondes = today.getSeconds() >= 10 ? today.getSeconds() : '0' + today.getSeconds()
    msg = make_safe(msg);

    const errorName = msg.split(":", 1)[0];
    const errorMsg = msg.substr(msg.indexOf(":") + 1)

    //cmd.append(`<span style="color: red"><u><i>${heures}:${minutes}:${secondes}:</i></u> ${errorName}</span> à la ligne <strong>#${line} :<br></strong>"${msg}"<br>`)
    const errorTitle = linkToLine(`<u>${errorName} à la ligne #${line}</u>`, line);

    cmd.append(
        `<span style="color: red">
            ${errorTitle}:
        </span>
        <br>
        → ${errorMsg}
        <br>`
    )
    cmd[0].scrollTop = cmd[0].scrollHeight
}

function linkToLine(text: string, line: number) {
    return `<a>
            <span onclick="editor.gotoLine(${line}); editor.selection.selectLine()">
                    ${text}
            </span>
            </a>`
}

function print_end(interrupted: boolean) {

}

function clear_cmd() {
    cmd.text('')
}
