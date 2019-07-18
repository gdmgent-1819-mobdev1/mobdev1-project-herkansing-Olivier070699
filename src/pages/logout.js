/* eslint-disable no-unused-vars */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const loginTemplate = require('../templates/login.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(loginTemplate)({ title, loading, posts }));

  if (localStorage.getItem('userEmail') != null) {
    // LOGOUT
    function logout(e) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('updateKey');
      firebase.auth().signOut();
      window.location.href = '/';
      }
      
    logout();
  } else {
    window.location.href = '#/login';
  }
};
