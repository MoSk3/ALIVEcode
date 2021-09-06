export const prettyField = (field: string) => {
	return field
		.split(' ')
		.map(t => t.substring(0, 1).toUpperCase() + t.substring(1))
		.join(' ');
};