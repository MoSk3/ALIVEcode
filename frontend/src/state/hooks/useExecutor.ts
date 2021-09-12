import { LevelExecutor } from '../../Pages/Level/LevelExecutor';
import { useState, useEffect } from 'react';
import { CMD } from '../../Components/LevelComponents/Cmd/cmdTypes';
import { ClassConstructor } from 'class-transformer';

const useExecutor = <T extends LevelExecutor>(
	U: ClassConstructor<T>,
	cmd: CMD | null,
) => {
	const [executor, setExecutor] = useState<T>();
	const [lines, setLines] = useState<string>('');

	useEffect(() => {
		if (executor) executor.lineInterfaceContent = lines;
	}, [executor, lines]);

	if (executor && cmd) executor.cmd = cmd;

	const toggleExecution = (ex: LevelExecutor) => {
		if (!ex) return;
		ex.execution = !ex.execution;
		const updatedExecutor = Object.assign(new U(), { ...ex });
		setExecutor(updatedExecutor);
	};

	if (executor && !executor.onToggleExecution)
		executor.onToggleExecution = toggleExecution;

	const setExecutorLines = (lines: string) => {
		setLines(lines);
	};

	return {
		executor,
		setExecutor,
		setExecutorLines,
	};
};

export default useExecutor;