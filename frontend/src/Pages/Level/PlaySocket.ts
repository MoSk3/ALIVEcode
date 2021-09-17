interface PlaySocketDeclaration extends WebSocket {
	compile_callback: (data: any) => void;
	robot_connect_callback: (data: any) => void;
	robot_callback: (data: any) => void;
}

export interface PlaySocket {
	compile: (lines: Array<string>, callback?: (data: any) => void) => void;
	stopCompile: () => void;
	response: (resp?: Array<any>) => void;
	robotConnect: (id: string, callback: (data: any) => void) => void;
	onRobotReceive: (callback: (data: any) => void) => void;
}

const openPlaySocket = (): PlaySocket => {
	let wsStart = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
	let endpoint = wsStart + window.location.hostname + ':8003/playground';
	let socket: WebSocket = new WebSocket(endpoint);

	const playSocketConstructor = (socket: PlaySocketDeclaration) => {
		socket.compile_callback = () => {};
		socket.robot_connect_callback = () => {};
		socket.robot_callback = () => {};
		socket.onopen = e => {};
		socket.onclose = e => {
			setTimeout(() => {
				openPlaySocket();
			}, 2000);
		};
		socket.onmessage = e => {
			let parsed;
			try {
				parsed = JSON.parse(e['data']);
			} catch (exception) {
				return;
			}
			if ('status' in parsed && 'data' in parsed) {
				let status = parsed['status'];
				let data = parsed['data'];
				switch (status) {
					case 'compiled':
						console.log(data);
						socket.compile_callback(data);
						break;
					case 'robot-data':
						socket.robot_callback(data);
						break;
					case 'connect-success':
						socket.robot_connect_callback({
							status: 'success',
						});
						break;
					case 'connect-error':
						if (typeof data === 'string') {
							socket.robot_connect_callback({
								status: 'error',
								error: data,
							});
						}
						break;
					default:
						if (process.env.DEBUG) console.log(data);
				}
			}
		};
		socket.onerror = e => {
			if (process.env.DEBUG) console.log('error:', e);
		};

		const compile = (
			lines: Array<string>,
			callback: (data: any) => void = () => {},
		) => {
			if (lines != null && Array.isArray(lines)) {
				// Check si tous les éléments sont des strings
				if (!lines.some(line => typeof line !== 'string')) {
					let data = {
						status: 'start',
						data: lines,
					};
					socket.compile_callback = callback;
					socket.send(JSON.stringify(data));
				}
			}
		};

		const stopCompile = () => {
			let data = {
				status: 'stop',
			};
			socket.send(JSON.stringify(data));
		};

		const response = (resp: Array<any> = []) => {
			if (Array.isArray(resp)) {
				let data = {
					status: 'response',
					data: resp,
				};
				socket.send(JSON.stringify(data));
				console.log(data);
			}
		};

		const robotConnect = (id: string, callback: (data: any) => void) => {
			if (id != null && typeof id === 'string') {
				let data = {
					status: 'connect',
					data: id,
				};
				socket.send(JSON.stringify(data));
			}
			socket.robot_connect_callback = callback;
		};

		const onRobotReceive = (callback: (data: any) => void) => {
			socket.robot_callback = callback;
		};

		return {
			compile,
			stopCompile,
			response,
			robotConnect,
			onRobotReceive,
		};
	};
	return playSocketConstructor(socket as PlaySocketDeclaration);
};

export default openPlaySocket;