
export enum CompileStatus {
  INTERRUPT = 'interrupted',
}

export class CompileDTO {
	lines?: string;

	status?: CompileStatus;

	idToken?: string;

	responseData?: string[];

	context?: { [val: string]: any };
}
