import axios from 'axios';
import { LevelExecutor } from '../LevelExecutor';

export default class LevelCodeExecutor extends LevelExecutor {
	public async onRun() {
		// Envoie le code à exécuter au serveur
		const lines: string = this.lineInterfaceContent;

		try {
			let { idToken, result: data } = await this.sendDataToAsServer({
				lines,
			});
			if (process.env.DEBUG) console.log(idToken, data);

			while (true) {
				let res = this.execute(data);
				if ((Array.isArray(res) && res.length === 0) || res === undefined) {
					break;
				} else {
					({ idToken, result: data } = await this.sendDataToAsServer({
						idToken,
						'response-data': res,
					}));
				}
			}
		} catch {
			this.cmd?.error(
				"Une erreur semble être survenue lors de la compilation de votre code, il se peut que les services d'alivescript soient présentement hors-service",
				0,
			);
			this.stop();
		}
	}

	public onStop() {}
	public init(s: any) {}

	private async sendDataToAsServer(
		data: { lines: string } | { idToken: string; 'response-data': string[] },
	) {
		return (
			await axios({
				method: 'POST',
				url: '/compile/',
				baseURL: process.env.REACT_APP_AS_URL,
				data,
			})
		).data;
	}

	public execute(data: any) {
		const res: any = [];
		const ID = 'id';
		const DODO = 'd';
		const PARAMS = 'p';

		const validDataStructure = (action: any) => {
			return (
				ID in action &&
				typeof action[ID] === 'number' &&
				DODO in action &&
				typeof action[DODO] === 'number' &&
				PARAMS in action &&
				Array.isArray(action[PARAMS])
			);
		};

		const perform_action = (i: number) => {
			if (i >= data.length) {
				//this.socket?.response(res);
				this.stop();
				return;
			}
			const action = data[i];
			if (validDataStructure(action)) {
				if (action[DODO] < 0) action[DODO] = 0;

				const { [DODO]: dodo, [ID]: id, [PARAMS]: params } = action;

				// Traite l'action a effectuée envoyée par le serveur
				switch (id) {
					/*
                                ----    UTILITAIRES    ----
                        */
					case 300:
						/*----     print     ----*/

						if (params.length > 0 && typeof params[0] === 'string') {
							this.cmd?.print(params[0]);
						}
						if (dodo === 0) perform_action(i + 1);
						else {
							this.timeouts.push(
								setTimeout(() => {
									perform_action(i + 1);
								}, dodo * 1000),
							);
						}
						break;
					case 301:
						/*----     attendre     ----*/
						if (params.length > 0 && typeof params[0] === 'number') {
							this.timeouts.push(
								setTimeout(() => {
									perform_action(i + 1);
								}, params[0] * 1000),
							);
						}
						break;
					/*
                                ----    GET    ----
                        */
					case 500:
						switch (params[0]) {
							case 'read': {
								/*----     lire     ----*/
								let input = prompt(params[1]);
								res.push(input);
								perform_action(i + 1);
							}
						}
						break;
					/*
                                ----    SET    ----
                        */
					case 600:
						break;
				}

				/*
                            ----    ERREURS    ----
                    */
				if (id.toString()[0] === '4') {
					if (
						params.length > 1 &&
						typeof params[0] === 'string' &&
						typeof params[2] === 'number'
					) {
						this.cmd?.error(params[0] + ': ' + params[1], params[2]);
					}
				}
			}
		};

		// Check si le data est valide
		if (Array.isArray(data) && data.length > 0) {
			perform_action(0);
		}
		return res;
	}
}
