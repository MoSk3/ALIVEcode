import { CMD } from '../../Components/LevelComponents/Cmd/cmdTypes';
import { User } from '../../Models/User/user.entity';

export abstract class LevelExecutor {
	public cmd?: CMD;
	public lineInterfaceContent: string = '';
	public timeouts: Array<NodeJS.Timeout> = [];
	public execution: boolean = false;

	constructor(public levelName: string, public creator?: User) {}

	public toggleExecution() {
		this.execution ? this.stop() : this.run();
	}

	public run() {
		this.execution = true;
		this.cmd?.clear();
		this.onRun();
	}

	public stop() {
		this.execution = false;
		// Clear all the timouts of the execution
		for (let timeout of this.timeouts) {
			clearTimeout(timeout);
		}
		this.onStop();
	}

	public abstract init(args: any): any;
	public abstract onRun(): any;
	public abstract onStop(): any;
}