import React, { useState } from 'react';
import Home from './Home';
import Login from './Login';

function Index(props) {

  const [isLoggedIn, set_isLoggedIn] = useState(false);
  const [userData, set_userData] = useState('');

  const handleLogUserIn = userData => {
    console.log(userData);
    set_userData(userData);
    set_isLoggedIn(true);
  }

  return isLoggedIn ? (
    <Home userData={userData}/>
  ) : (
    <Login logUserIn={(userData) => handleLogUserIn(userData)} />
  );

}

export default Index;
