import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../components/Home";
import Tavern from "../components/Tavern";

function AppRouter() {
  return (
    <Router>
        <Route path="/" exact component={Home} />
        <Route path="/tavern/:tavernId" component={Tavern} />
      </Router>
  );
}

export default AppRouter;
