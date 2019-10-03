import React from 'react';
import FirebaseUserProvider from "./context/ContextFirebaseUserProvider";
import FirebaseTavernProvider from "./context/ContextFirebaseTavernProvider";
import MessageProvider from "./context/ContextMessageProvider";
import AppRouter from './router/AppRouter';

function App() {
  return (
    <MessageProvider>
      <FirebaseUserProvider>
        <FirebaseTavernProvider>
          <div className="buzzin-app">
            <AppRouter />
          </div>
        </FirebaseTavernProvider>
      </FirebaseUserProvider>
    </MessageProvider>
  );
}

export default App;
