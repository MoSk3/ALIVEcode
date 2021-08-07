import { GenericCardProps } from '../CardContent/genericCardTypes';
import GenericCard from '../CardContent/GenricCard';

const Card = (props: GenericCardProps) => {
	return (
		<GenericCard
			margin="15px 25px"
			scale={1.05}
			width={220}
			height={300}
			boxShadow="0px 15px 30px rgb(131, 131, 131)"
			{...props}
		/>
	);
};

export default Card;