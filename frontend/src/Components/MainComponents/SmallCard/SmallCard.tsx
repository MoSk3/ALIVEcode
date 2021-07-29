import { Card } from 'react-bootstrap';
import { SmallCardProps } from './smallCardTypes';

const SmallCard = (props: SmallCardProps) => {

  return (
    <Card>
      {props.children}
    </Card>
  );
}

export default SmallCard