import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "../components/Index";
import Login from '../components/Auth/Login';
import Logout from '../components/Auth/Logout';
import User from "../components/User/Index";
import Room from "../components/Tavern/Room";
import TavernHome from "../components/Tavern/Home";
import Settings from "../components/Settings/Index";
import Navigation from '../components/Navigation';

function AppRouter() {
  return (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/login" exact component={Login} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/user/:userId" component={User} />
      <Route path="/settings" component={Settings} />
      <Route path="/taverns" component={TavernHome} />
      <Route path="/tavern/:tavernId" component={Room} />
      <Navigation />
    </Router>
  );
}

export default AppRouter;
