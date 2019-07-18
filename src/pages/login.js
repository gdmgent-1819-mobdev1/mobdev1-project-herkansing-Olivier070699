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

  if (localStorage.getItem('userEmail') == null) {
    // ADD BUTTON
    const btnLogin = document.getElementById('btnLogin');

    // LOGIN
    btnLogin.addEventListener('click', (e) => {
      const txtEmail = document.getElementById('email').value;
      const txtPassword = document.getElementById('wachtwoord').value;
      const auth = firebase.auth();

      const promise = auth.signInWithEmailAndPassword(txtEmail, txtPassword);
      promise
        .then((response) => {
          localStorage.setItem('userEmail', txtEmail);
          window.location = '#/kotenOverzicht';
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorCode, errorMessage);
          document.getElementById('foutMelding').innerHTML = `${errorCode} - ${errorMessage}`;
        });
    });
  } else {
    window.location.href = '#/kotenOverzicht';
  }
};
