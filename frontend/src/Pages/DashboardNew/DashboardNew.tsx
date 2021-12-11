import { DashboardNewProps, StyledDashboard } from './dashboardNewTypes';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../state/contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { Classroom } from '../../Models/Classroom/classroom.entity';
import { plainToClass } from 'class-transformer';
import useRoutes from '../../state/hooks/useRoutes';
import api from '../../Models/api';
import FormModal from '../../Components/UtilsComponents/FormModal/FormModal';
import JoinClassroomForm from '../../Components/ClassroomComponents/JoinClassroomForm/JoinClassroomForm';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';

/**
 * Dashboard page that contains all the links to the different pages of the plaform
 *
 * @author MoSk3
 */
const DashboardNew = (props: DashboardNewProps) => {
	const { user } = useContext(UserContext);
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [classrooms, setClassrooms] = useState<Classroom[]>([]);
	const history = useHistory();
	const { routes } = useRoutes();
	const [formJoinClassOpen, setFormJoinClassOpen] = useState(false);

	useEffect(() => {
		if (!user) return;
		const getClassrooms = async () => {
			const data = await api.db.users.getClassrooms({
				id: user.id,
			});
			setLoading(false);
			setClassrooms(data.map((d: any) => plainToClass(Classroom, d)));
		};
		getClassrooms();
	}, [user]);

	return (
		<StyledDashboard>
			<Row>
				<Col className="sidebar no-float" lg={1} md={2} sm={3}>
					yo
				</Col>
				<Col className="content no-float" lg={11} md={10} sm={9}>
					boo
				</Col>
			</Row>
			<FormModal
				title={t('form.join_classroom.title')}
				open={formJoinClassOpen}
				onClose={() => setFormJoinClassOpen(false)}
			>
				<JoinClassroomForm />
			</FormModal>
		</StyledDashboard>
	);
};

export default DashboardNew;