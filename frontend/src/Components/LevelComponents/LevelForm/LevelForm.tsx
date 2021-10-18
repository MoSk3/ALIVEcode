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
import { LevelCode } from '../../../Models/Level/levelCode.entity';
import { LevelAI } from '../../../Models/Level/levelAI.entity';
import { MATCHES } from '../../UtilsComponents/Form/formTypes';

/**
 * Component that renders the create form for the selected level type
 *
 * @param {string} type type of the level to create: ALIVE, IoT, code or AI
 *
 * @author MoSk3
 */
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
								routes.auth.level_edit.path.replace(':levelId', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						name="level"
						url="levels/alive"
						action="POST"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'text',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								default: LEVEL_ACCESS.PRIVATE,
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
			case 'AI':
				return (
					<Form
						onSubmit={res => {
							const level: LevelAI = res.data;
							history.push(
								routes.auth.level_edit.path.replace(':levelId', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						name="level"
						url="levels/ai"
						action="POST"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'text',
								maxLength: 500,
							},
							{
								name: 'access',
								required: true,
								inputType: 'select',
								default: LEVEL_ACCESS.PRIVATE,
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
			case 'code':
				return (
					<Form
						onSubmit={res => {
							const level: LevelCode = res.data;
							history.push(
								routes.auth.level_edit.path.replace(':levelId', level.id),
							);
							return alert.success('Niveau créé avec succès');
						}}
						name="level"
						url="levels/code"
						action="POST"
						inputGroups={[
							{
								name: 'name',
								inputType: 'text',
								required: true,
								minLength: 3,
								maxLength: 100,
							},
							{
								name: 'description',
								inputType: 'text',
								maxLength: 500,
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
