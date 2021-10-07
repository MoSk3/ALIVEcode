/* eslint-disable no-labels */
import LevelCodeExecutor from '../LevelCode/LevelCodeExecutor';

// TODO: robotConnected

class LevelAIExecutor extends LevelCodeExecutor {
	private executableFuncs: any;

	constructor(executables: {[key: string]: CallableFunction}, levelName: string, creator?: any) {
		super(levelName, creator);
		this.executableFuncs = executables;
	}

	public init(s: any) {}

	public async onRun() {
		super.onRun();
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
					/*
																----		ARTIFICIAL INTELLIGENCE		----
													*/
					case 800:
						if (params.every((param: any) => typeof param === 'number')) { 
							this.executableFuncs.createAndShowReg(params[0], params[1], params[2], params[3]);
						}
						perform_action(i + 1);
						break;
					case 801:
						
						break;
					case 802:
						this.executableFuncs.showDataCloud();
						perform_action(i + 1);
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
			this.executableFuncs.resetGraph();
			perform_action(0);
		}
		return res;
	}

	override onStop() {
		this.executableFuncs.resetGraph();
	}
}

export default LevelAIExecutor;