import { StudentCardProps } from './studentCardTypes';

const StudentCard = ({ student }: StudentCardProps) => {
	return (
		<div className="w-100 student-card" style={{ marginBottom: '10px' }}>
			<h4>{student.name}</h4>
		</div>
	);
};

export default StudentCard;