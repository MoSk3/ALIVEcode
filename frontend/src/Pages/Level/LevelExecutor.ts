import { CMD } from '../../Components/LevelComponents/Cmd/cmdTypes';
import { User } from '../../Models/User/user.entity';

export abstract class LevelExecutor {
	public cmd?: CMD;
	public lineInterfaceContent: string = '';
	public timeouts: Array<NodeJS.Timeout> = [];
	public execution: boolean = false;
	public onToggleExecution?: (exec: any) => void;
	protected whenExecutionEnd: (result: any[]) => void;

	constructor(public levelName: string, public creator?: User) {}

	public toggleExecution() {
		this.onToggleExecution && this.onToggleExecution(this);
		this.execution ? this.run() : this.stop();
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
		this.onStop();
	}

	public abstract init(args: any): any;
	public abstract onRun(): any;
	public abstract onStop(): any;
}