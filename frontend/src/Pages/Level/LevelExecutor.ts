import { CMD } from "../../Components/PlayComponents/Cmd/cmdTypes";
import { PlaySocket } from './PlaySocket';
import $ from 'jquery';
import axios from 'axios';
import { User } from '../../Models/User/user.entity';

export default class LevelExecutor {
	public playButton: JQuery;
	public socket?: PlaySocket;
	public cmd?: CMD;
	public lineInterfaceContent: string = '';
	public timeouts: Array<NodeJS.Timeout> = [];
	public execution: boolean = false;

	public levelName?: string;
	public creator?: User | undefined;

	constructor(
		creator: User | undefined,
		levelName: string,
		playButton: HTMLButtonElement,
	) {
		this.creator = creator;
		this.levelName = levelName;
		this.playButton = $(playButton);
		this.init();
	}

	init() {
		this.playButton.on('click', async (e: any) => {
			if (!this.execution) {
				this.execution = true;
				// Envoie le code à exécuter au serveur
				const lines: string = this.lineInterfaceContent;

				const data = await (
					await axios({
						method: 'POST',
						url: '/compile/',
						baseURL: 'http://localhost:8001',
						data: { lines },
					})
				).data;

				this.execute(data);
			} else {
				this.cmd?.clear();
				this.execution = false;

				// Clear tous les timeouts de la simulation
				for (let timeout of this.timeouts) {
					clearTimeout(timeout);
				}
			}
		});
	}

	execute(data: any) {
		const perform_action = (
			i: number,
			res: Array<any> | undefined = undefined,
		) => {
			if (res === undefined) res = [];
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

			if (i >= data.length) {
				this.socket?.response(res);
				return;
			}
			let action = data[i];
			if (validDataStructure(action)) {
				let dodo = action[DODO] >= 0 ? action[DODO] : 0;
				let id = action[ID];
				let params = action[PARAMS];

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
						if (dodo === 0) perform_action(i + 1, res);
						else {
							this.timeouts.push(
								setTimeout(() => {
									perform_action(i + 1, res);
								}, dodo * 1000),
							);
						}
						break;
					case 301:
						/*----     attendre     ----*/
						if (params.length > 0 && typeof params[0] === 'number') {
							this.timeouts.push(
								setTimeout(() => {
									perform_action(i + 1, res);
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
								let input = prompt("Entrez l'input");
								res.push(input);
								perform_action(i + 1, res);
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
	}
}
