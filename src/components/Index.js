import React, { useState } from 'react';
import Home from './Home';
import Login from './Login';

function Index(props) {

  const [isLoggedIn, set_isLoggedIn] = useState(false);

  // const handlePinCorrect = () => {
  //   set_pinCorrect(true);
  // }

  return isLoggedIn ? (
    <Home />
  ) : (
    <Login />
  );

}

export default Index;
