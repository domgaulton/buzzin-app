import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ContextProvider from "../context/ContextFirebaseProvider";
import Home from "../components/Home";
import Tavern from "../components/Tavern";

function AppRouter() {
  return (
    <ContextProvider>
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/tavern/:tavernId" component={Tavern} />
      </Router>
    </ContextProvider>
  );
}

export default AppRouter;
