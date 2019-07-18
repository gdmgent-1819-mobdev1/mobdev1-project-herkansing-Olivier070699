const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: 'AIzaSyDEhHIoOY8d1LTMqF7wZ5Ipi4V-j4Ho3gI',
  authDomain: 'mobdev-verhuurder.firebaseapp.com',
  databaseURL: 'https://mobdev-verhuurder.firebaseio.com',
  projectId: 'mobdev-verhuurder',
  storageBucket: 'mobdev-verhuurder.appspot.com',
  messagingSenderId: '695238747675',
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};
