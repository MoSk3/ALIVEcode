import { LevelExecutor } from '../../Pages/Level/LevelExecutor';
import { useState } from 'react';
import { CMD } from '../../Components/LevelComponents/Cmd/cmdTypes';
import { ClassConstructor } from 'class-transformer';

const useExecutor = <T extends LevelExecutor>(
	U: ClassConstructor<T>,
	cmd: CMD | null,
) => {
	const [executor, setExecutor] = useState<T>();

	if (executor && cmd) executor.cmd = cmd;

	const toggleExecution = () => {
		if (!executor) return;
		executor?.toggleExecution();
		setExecutor(Object.assign(new U(), { ...executor }));
	};

	const setExecutorLines = (lines: string) => {
		if (executor) executor.lineInterfaceContent = lines;
	};

	return {
		executor,
		setExecutor,
		toggleExecution,
		setExecutorLines,
	};
};

export default useExecutor;