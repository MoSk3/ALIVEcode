import { RefObject, useRef } from 'react';
import $ from 'jquery';
import { CMD } from '../../Components/PlayComponents/Cmd/cmdTypes';

const useCmd = (): [ref: RefObject<HTMLDivElement>, cmd: CMD | null] => {
	const cmd = useRef<HTMLDivElement>(null);

	if (!cmd || !cmd.current) return [cmd, null];

	const make_safe = (msg: string) =>
		msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	const print = (msg: string) => {
		if (!cmd.current) return;
		const $cmd = $(cmd.current);
		msg = make_safe(msg);
		//cmd.append(`<span><u><i>${heures}:${minutes}:${secondes}:</i></u> ${msg}</span><br>`)
		$cmd.append(`<span>${msg}</span><br>`);
		$cmd.scrollTop(cmd.current.scrollHeight);
	};

	const error = (msg: string, line: number) => {
		if (!cmd.current) return;
		const $cmd = $(cmd.current);
		msg = make_safe(msg);

		const errorName = msg.split(':', 1)[0];
		const errorMsg = msg.substr(msg.indexOf(':') + 1);

		//cmd.append(`<span style="color: red"><u><i>${heures}:${minutes}:${secondes}:</i></u> ${errorName}</span> à la ligne <strong>#${line} :<br></strong>"${msg}"<br>`)
		const errorTitle = linkToLine(
			`<u>${errorName} à la ligne #${line}</u>`,
			line,
		);

		$cmd.append(
			`<span style="color: red">
					${errorTitle}:
			</span>
			<br>
			→ ${errorMsg}
			<br>`,
		);

		$cmd.scrollTop(cmd.current.scrollHeight);
	};

	const clear = () => {
		if (!cmd.current) return;
		cmd.current.innerHTML = '';
	};

	function linkToLine(text: string, line: number) {
		return `<a>
            <span onclick="editor.gotoLine(${line}); editor.selection.selectLine()">
                    ${text}
            </span>
            </a>`;
	}

	return [
		cmd,
		{
			print,
			error,
			clear,
		},
	];
};

export default useCmd;