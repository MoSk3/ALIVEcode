import { BrowsingMenuProps, StyledBrowsingMenu, BrowsingQuery } from './browsingMenuTypes';
import SearchBar from './SearchBar/SearchBar';
import { useState, useEffect } from 'react';
import Button from '../../UtilsComponents/Button/Button';
import api from '../../../Models/api';

const BrowsingMenu = <T extends any>({
	onChange,
	fetchOnSubmit,
}: BrowsingMenuProps<T>) => {
	const [query, setQuery] = useState<BrowsingQuery>({});
	const [oldQuery, setOldQuery] = useState<BrowsingQuery>();

	const getResults = async () => {
		if (JSON.stringify(oldQuery) === JSON.stringify(query)) return;
		console.log('NEW SEARCH');
		const levels = await api.db.levels.query(query);
		setOldQuery(query);
		onChange({
			results: levels as Array<T>,
			nbResults: levels.length,
		});
	};

	useEffect(() => {
		getResults();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<StyledBrowsingMenu>
			<div>
				<SearchBar
					value={query.txt || ''}
					setValue={txt => setQuery({ ...query, txt })}
					onSubmit={() => fetchOnSubmit && getResults()}
				/>
			</div>
			<div>
				<Button variant="primary" onClick={getResults}>
					Search
				</Button>
			</div>
		</StyledBrowsingMenu>
	);
};

export default BrowsingMenu;