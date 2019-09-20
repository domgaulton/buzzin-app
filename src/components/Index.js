import React, { useState } from 'react';
import Home from './Home';
import Login from './Login';

function Index(props) {

  const [isLoggedIn, set_isLoggedIn] = useState(false);

  const handleLogUserIn = userData => {
    console.log(userData);
    set_isLoggedIn(true);
  }

  return isLoggedIn ? (
    <Home/>
  ) : (
    <Login logUserIn={(userData) => handleLogUserIn(userData)} />
  );

}

export default Index;
