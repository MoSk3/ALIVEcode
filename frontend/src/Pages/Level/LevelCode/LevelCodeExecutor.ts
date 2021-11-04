import { LevelExecutor } from '../AbstractLevelExecutor';
import { typeAskForUserInput } from '../levelTypes';

export default class LevelCodeExecutor extends LevelExecutor {
	constructor(
		public levelName: string,
		protected askForUserInput: typeAskForUserInput,
		public creator?: any,
	) {
		super(levelName, creator);

		this.registerActions(
			{
				actionId: 300,
				action: {
					label: 'afficher',
					type: 'NORMAL',
					apply: params => {
						if (params.length > 0 && typeof params[0] === 'string') {
							this.cmd?.print(params[0]);
						}
					},
				},
			},
			{
				actionId: 301,
				action: {
					label: 'attendre',
					type: 'NORMAL',
					apply: params => {
						if (params.length > 0 && typeof params[0] === 'number') {
							this.timeouts.push(
								setTimeout(() => {
									this.perform_next();
								}, params[0] * 1000),
							);
						}
					},
					handleNext: true,
				},
			},
			{
				actionId: 1,
				action: {
					label: 'read input',
					type: 'GET',
					apply: (params, _, response) => {
						this.askForUserInput(params[1], inputValue => {
							response?.push(inputValue);
							this.perform_next();
						});
					},
					handleNext: true,
				},
			},
		);
	}

	public onStop() {}
	public init(s: any) {}

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
			try {
				if (i >= data.length || !this.execution) {
					//this.socket?.response(res);
					// this.whenExecutionEnd(res);
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
									console.log('read');
									this.askForUserInput(params[1], inputValue => {
										res.push(inputValue);
										perform_action(i + 1);
									});
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
							this.interrupt();
						}
					}
				}
			} catch (error) {
				if (process.env.REACT_APP_DEBUG) console.log(error);
				// this.whenExecutionEnd(res);
			}
		};

		// Check si le data est valide
		if (Array.isArray(data) && data.length > 0) {
			perform_action(0);
		}
		return res;
	}
}
