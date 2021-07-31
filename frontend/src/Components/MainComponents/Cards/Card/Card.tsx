import GenericCard from '../CardContent/GenricCard';
import { GenericCardProps } from '../CardContent/genericCardTypes';


const Card = (props: GenericCardProps) => {

  return (
    <GenericCard margin='25px 50px' width={300} height={380} boxShadow='0px 15px 30px rgb(131, 131, 131)' />
  );
}

export default Card;