import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

const app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false,
    );

    // document.addEventListener(
    //   'orientationchange',
    //   this.orientationChange.bind(this),
    //   false,
    // );
  },

  // // orientationChange Event Handler
  // orientationChange: function() {
  //   const appNotch = document.querySelector('.iq-app-margin-top');
  //   const appNotchHeight = `${appNotch.getBoundingClientRect().height}px`;
  //   appNotch.style.height = '1px';
  //   setTimeout(function() {
  //     appNotch.style.height = appNotchHeight;
  //   }, 100);
  // },

  // deviceready Event Handler
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    // if (window.Keyboard) {
    //   window.Keyboard.shrinkView(true);
    //   window.Keyboard.hideFormAccessoryBar(false);
    // }

    ReactDOM.render(<App />, document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
  },
};

if (window.cordova) {
  app.initialize();
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
