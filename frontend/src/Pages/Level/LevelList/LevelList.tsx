import { useState, useContext } from 'react';
import { Level } from '../../../Models/Level/level.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import LevelCard from '../../../Components/LevelComponents/LevelCard/LevelCard';
import BrowsingMenu from '../../../Components/MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';
import { UserContext } from '../../../state/contexts/UserContext';
import { useHistory } from 'react-router-dom';
import {
	LevelBrowseProps,
	StyledLevelBrowse,
} from '../LevelBrowse/levelBrowseTypes';

const LevelBrowse = (props: LevelBrowseProps) => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Level>>();
	const levels = browsingResult?.results;
	const { user } = useContext(UserContext);
	const history = useHistory();

	if (!user) {
		history.push('/');
		return <></>;
	}

	return (
		<StyledLevelBrowse>
			<BrowsingMenu<Level>
				fetchOnSubmit
				apiRequest={query => api.db.users.getLevels(user?.id, query)}
				onChange={res => setBrowsingResult(res)}
			/>
			<div className="levels">
				{!levels ? (
					<LoadingScreen relative />
				) : (
					<>
						{levels.map((l, idx) => (
							<LevelCard level={l} key={idx} />
						))}
					</>
				)}
			</div>
		</StyledLevelBrowse>
	);
};

export default LevelBrowse;