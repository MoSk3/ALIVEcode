import axios from 'axios';
import { CMD } from '../../Components/LevelComponents/Cmd/cmdTypes';
import { User } from '../../Models/User/user.entity';
import { typeAction } from './levelTypes';

export class LevelExecutor {
	public cmd?: CMD;
	public lineInterfaceContent: string = '';
	public timeouts: Array<NodeJS.Timeout> = [];
	public execution: boolean = false;
	public onToggleExecution?: (exec: any) => void;
	private idToken: string;
	private current_execution: Generator | null = null;
	private registeredActions: { [actionId: number]: typeAction };

	/** function called before the exection of the code */
	private _beforeRun: () => void;

	/** function called before the interruption of the execution of the code */
	private _beforeInterrupt: () => void;
	/** function called before the end of the exection of the code */
	private _beforeStop: () => void;
	/** function called after the end or the interruption of the exection of the code */
	private _afterStop: () => void;

	constructor(public levelName: string, public creator?: User) {}

	protected async sendDataToAsServer(
		data:
			| { lines: string }
			| { idToken: string; 'response-data': string[] }
			| { idToken: string; status: 'interrupted' },
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
				-1,
			);
		}
	}

	protected registerActions(
		...actions: { actionId: number; action: typeAction }[]
	) {
		actions.forEach(
			action => (this.registeredActions[action.actionId] = action.action),
		);
	}

	public toggleExecution() {
		this.onToggleExecution && this.onToggleExecution(this);
		this.execution ? this.run() : this.interrupt();
	}

	public run() {
		!this.execution && this.onToggleExecution && this.onToggleExecution(this);
		this.cmd?.clear();
		this.onRun();
	}

	public stop() {
		this.execution && this.onToggleExecution && this.onToggleExecution(this);
		// Clear all the timouts of the execution
		for (let timeout of this.timeouts) {
			clearTimeout(timeout);
		}
		this.current_execution = null;
		this._afterStop && this._afterStop();
	}

	public async interrupt() {
		try {
			this._beforeInterrupt && this._beforeInterrupt();
		} finally {
			if (this.idToken) {
				await this.sendDataToAsServer({
					idToken: this.idToken,
					status: 'interrupted',
				});
			}
			this.stop();
		}
	}

	private async executeNext(res: string[], firstTime = false) {
		const data = await this.sendDataToAsServer(
			firstTime
				? {
						lines: this.lineInterfaceContent,
				  }
				: {
						idToken: this.idToken,
						'response-data': res,
				  },
		);

		if (!data || !this.execution) {
			this.interrupt();
			return;
		}
		if (process.env.REACT_APP_DEBUG) console.log(data);
		if (data.status === 'ongoing') {
			this.idToken = data.idToken;
		}
		this.execute(data.result);
	}

	public async onRun() {
		this._beforeRun && this._beforeRun();
		try {
			// Envoie le code à exécuter au serveur
			this.executeNext([], true);
		} catch (err) {
			this.interrupt();
		}
	}

	private *perform_actions(
		actions: { id: number; params: any[]; dodo: number }[],
	) {
		const response: any[] = [];

		for (const action of actions) {
			if (!(action.id in this.registeredActions)) {
				throw new Error(
					`The action id: ${action.id} is not in the registered actions`,
				);
			}
			const performedAction = this.registeredActions[action.id];
			performedAction.apply(action.params, action.dodo, response);
			if (performedAction.handleNext) yield;
		}
	}

	protected perform_next() {
		this.current_execution?.next();
	}

	protected execute(actions: any[]): void {
		const res: any = [];
		const ID = 'id';
		const DODO = 'd';
		const PARAMS = 'p';

		const hasValidDataStructure = (action: any): boolean => {
			return (
				ID in action &&
				typeof action[ID] === 'number' &&
				DODO in action &&
				typeof action[DODO] === 'number' &&
				PARAMS in action &&
				Array.isArray(action[PARAMS])
			);
		};
		const formatedActions = actions.map(action => {
			if (!hasValidDataStructure(action)) {
				this.interrupt();
				throw new Error();
			}
			return {
				id: action[ID] as number,
				params: action[PARAMS] as any[],
				dodo: action[DODO] as number,
			};
		});

		this.current_execution = this.perform_actions(formatedActions);
	}

	public beforeRun(callback: () => void): void {
		this._beforeRun = callback;
	}

	public beforeInterrupt(callback: () => void): void {
		this._beforeInterrupt = callback;
	}

	public beforeStop(callback: () => void): void {
		this._beforeStop = callback;
	}

	public afterStop(callback: () => void): any {
		this._afterStop = callback;
	}
}