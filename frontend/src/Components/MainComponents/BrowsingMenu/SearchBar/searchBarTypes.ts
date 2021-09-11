export type SearchBarProps = {
	value: string;
	setValue: (txt: string) => void;
	onSubmit?: (txt: string) => void;
};
