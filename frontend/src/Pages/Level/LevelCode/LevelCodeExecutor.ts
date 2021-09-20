import axios from 'axios';
import { LevelExecutor } from '../LevelExecutor';

export default class LevelCodeExecutor extends LevelExecutor {
	public async onRun() {
		// Envoie le code à exécuter au serveur
		const lines: string = this.lineInterfaceContent;

		try {
			let data = await this.sendDataToAsServer({ lines });
			if (data.status === 'complete') {
				this.execute(data.result);
				return;
			}

			const { idToken } = data;

			if (process.env.DEBUG) console.log(idToken, data.data);

			while (true) {
				let res = this.execute(data.result);
				if ((Array.isArray(res) && res.length === 0) || res === undefined) {
					break;
				} else {
					data = await this.sendDataToAsServer({
						idToken,
						'response-data': res,
					});
				}
			}
		} catch {
			this.stop();
		}
	}

	public onStop() {}
	public init(s: any) {}

	private async sendDataToAsServer(
		data: { lines: string } | { idToken: string; 'response-data': string[] },
	) {
		try {
			return (
				await axios({
					method: 'POST',
					url: '/compile/',
					baseURL: process.env.REACT_APP_AS_URL,
					data,
				})
			).data;
		} catch {
			this.cmd?.error(
				"Une erreur inconnue est survenue. Vérifiez pour des erreurs dans votre code, sinon, les services d'alivescript sont hors-ligne.",
				0,
			);
		}
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
