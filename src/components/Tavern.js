import React, { useState } from 'react';
import TavernLogin from './TavernLogin';
import TavernRoom from './TavernRoom';

function Tavern(props) {

  const [pinCorrect, set_pinCorrect] = useState(true);

  const handlePinCorrect = () => {
    set_pinCorrect(true);
  }

  return pinCorrect ? (
    <TavernRoom tavernId={props.match.params.tavernId} />
  ) : (
    <TavernLogin tavernId={props.match.params.tavernId} pinEntered={unlock => handlePinCorrect()}/>
  );

}

export default Tavern;
