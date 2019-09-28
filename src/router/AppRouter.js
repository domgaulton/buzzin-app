import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "../components/Index";
import User from "../components/User/Index";
import Tavern from "../components/Tavern/Index";
import Settings from "../components/Settings/Index";
import Navigation from '../components/Navigation';

function AppRouter() {
  return (
    <Router>
      <Route path="/" exact component={Index} />
      <Route path="/user/:userId" component={User} />
      <Route path="/settings/:userId" component={Settings} />
      <Route path="/tavern/:tavernId" component={Tavern} />
      <Navigation />
    </Router>
  );
}

export default AppRouter;
