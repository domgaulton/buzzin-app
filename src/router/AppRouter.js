import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import FirebaseUserProvider from "../context/ContextFirebaseUserProvider";
import FirebaseTavernProvider from "../context/ContextFirebaseTavernProvider";
import Index from "../components/Index";
import User from "../components/User";
import Tavern from "../components/Tavern";

function AppRouter() {
  return (
    <FirebaseUserProvider>
      <FirebaseTavernProvider>
        <Router>
          <Route path="/" exact component={Index} />
          <Route path="/user/:userId" component={User} />
          <Route path="/tavern/:tavernId" component={Tavern} />
        </Router>
      </FirebaseTavernProvider>
    </FirebaseUserProvider>
  );
}

export default AppRouter;
