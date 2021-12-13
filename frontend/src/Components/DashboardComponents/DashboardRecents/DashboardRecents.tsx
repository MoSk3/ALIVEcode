import { Col, Container, Row } from 'react-bootstrap';
import { StyledDashboardRecent } from './dashboardRecentTypes';
import { useContext } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import CourseCard from '../../CourseComponents/CourseCard/CourseCard';

export const DashboardRecents = () => {
	const { getCourses } = useContext(DashboardContext);

	return (
		<StyledDashboardRecent className="h-100">
			<Container fluid className="container-1">
				<Row className="h-100 no-gutters">
					<Col className="h-100 section-recents">
						<div className="section-title">Formations Récentes</div>
						<div className="underline"></div>

						<Container fluid className="h-100 mt-4 justify-content-start">
							<Row>
								{getCourses().map(c => (
									<Col className="mb-5" xs={12} sm={6} md={4} lg={3} xl={2}>
										<CourseCard course={c}></CourseCard>
									</Col>
								))}
							</Row>
						</Container>
					</Col>
				</Row>
			</Container>
			<Container fluid className="container-2">
				<Row className="h-100 no-gutters">
					<Col className="h-100 section-levels">
						<div className="section-title">Mes niveaux</div>
						<div className="underline"></div>
					</Col>
					<Col className="h-100 section-notifs">
						<div className="section-title">Notifications</div>
						<div className="underline"></div>
					</Col>
				</Row>
			</Container>
		</StyledDashboardRecent>
	);
};

export default DashboardRecents;