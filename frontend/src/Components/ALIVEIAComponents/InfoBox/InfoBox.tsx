import { useState } from 'react';
import { InfoBoxProps } from './infoBoxTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Collapse } from 'react-bootstrap';

const InfoBox = ({description, title}: InfoBoxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div id="container">
        <div id="section-head">
          <h2 id="section-title">{title}</h2>
          <FontAwesomeIcon 
            scale="10px" 
            id="collapse-button" 
            icon={faCaretUp}
            onClick={() => setOpen(!open)}
            aria-controls="section-description"
            aria-expanded={open}
          />
        </div>
        <Collapse in={open}>
          <p id="section-description">{description}</p>
        </Collapse>
      </div>
    </>

  );
}

export default InfoBox