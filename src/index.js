import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

Notification.requestPermission(function(status) {
  console.log('Notification permission status:', status);
});

displayNotification();

function displayNotification() {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration()
    .then(reg => {
      if (reg) {
        var options = {
          body: 'Here is a notification body!',
          icon: 'images/example.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {action: 'explore', title: 'Explore this new world',
              icon: 'images/checkmark.png'},
            {action: 'close', title: 'Close notification',
              icon: 'images/xmark.png'},
          ]
        };
        reg.showNotification('Hello world!', options);
      } else {
        console.error('No response from getRegistration')
      }
    })
  }
}