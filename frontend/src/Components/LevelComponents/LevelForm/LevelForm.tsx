import Form from '../../UtilsComponents/Form/Form';
import { LevelFormProps } from './levelFormTypes';
import { useHistory } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { LevelAlive } from '../../../Models/Level/levelAlive.entity';
import { useTranslation } from 'react-i18next';
import {
	LEVEL_ACCESS,
	LEVEL_DIFFICULTY,
} from '../../../Models/Level/level.entity';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
const LevelForm = ({ type }: LevelFormProps) => {
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const alert = useAlert();
	const history = useHistory();

	const getSpecificLevel = () => {
		switch (type) {
			case 'ALIVE':
				return (
					<Form
						onSubmit={res => {
							const level: LevelAlive = res.data;
							history.push(
								routes.auth.level_play.path.replace(':id', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						buttonText={t('form.submit.create_classrooms')}
						name="create_classroom"
						url="levels/alive"
						action="POST"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
							},
							{
								name: 'access',
								inputType: 'text',
								required: true,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_ACCESS,
							},
							{
								name: 'difficulty',
								required: true,
								inputType: 'select',
								selectOptions: LEVEL_DIFFICULTY,
							},
						]}
					/>
				);
		}

		return <label>doesnt exist</label>;
	};

	return (
		<FormContainer title={t('form.title.create_level')}>
			{getSpecificLevel()}
		</FormContainer>
	);
};

export default LevelForm;
