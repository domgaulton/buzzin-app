import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "../components/App";
import Tavern from "../components/Tavern";

function AppRouter() {
  return (
    <Router>
        <Route path="/" exact component={App} />
        <Route path="/tavern/:tavernId" component={Tavern} />
      </Router>
  );
}

export default AppRouter;
