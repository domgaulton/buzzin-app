import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "../components/Index";
import User from "../components/User/Index";
import Tavern from "../components/Tavern/Index";

function AppRouter() {
  return (
    <Router>
      <Route path="/" exact component={Index} />
      <Route path="/user/:userId" component={User} />
      <Route path="/tavern/:tavernId" component={Tavern} />
    </Router>
  );
}

export default AppRouter;
