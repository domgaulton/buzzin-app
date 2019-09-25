import React from 'react';
import FirebaseUserProvider from "./context/ContextFirebaseUserProvider";
import FirebaseTavernProvider from "./context/ContextFirebaseTavernProvider";
import AppRouter from './router/AppRouter';

function App() {
  return (
    <FirebaseUserProvider>
      <FirebaseTavernProvider>
        <AppRouter />
      </FirebaseTavernProvider>
    </FirebaseUserProvider>
  );
}

export default App;
