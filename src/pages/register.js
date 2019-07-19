/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/register.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));
  if (localStorage.getItem('userEmail') == null) {
    // BTN
    const btnRegister = document.getElementById('register');

    if (document.getElementById('student').addEventListener('click', () => {
      document.getElementById('campus').style.display = 'block';
      const type = document.getElementById('student').value;
      localStorage.setItem('userType', type);
    }));

    if (document.getElementById('kotbaas').addEventListener('click', () => {
      document.getElementById('campus').style.display = 'none';
      const type = document.getElementById('kotbaas').value;
      localStorage.setItem('userType', type);
    }));

    btnRegister.addEventListener('click', (e) => {
      // ADD INFO
      const txtVoornaam = document.getElementById('voornaam').value;
      const txtAchternaam = document.getElementById('achternaam').value;
      const txtStraatnaam = document.getElementById('straatnaam').value;
      const nmrHuisnummer = document.getElementById('huisnummer').value;
      const nmrPostcode = document.getElementById('postcode').value;
      const txtStad = document.getElementById('stad').value;
      const txtEmail = document.getElementById('email').value;
      const nmrTelefoonnummer = document.getElementById('telefoonnummer').value;
      const txtPassword = document.getElementById('wachtwoord').value;
      const txtPasswordHerhaal = document.getElementById('wachtwoordHerhaal').value;
      const txtUserType = localStorage.getItem('userType');
      const campus = document.getElementById('campus').value;
      const auth = firebase.auth();

      if (txtPassword == txtPasswordHerhaal) {
        // SIGN IN
        const promise = auth.createUserWithEmailAndPassword(txtEmail, txtPassword);
        promise
          .then((response) => {
            localStorage.setItem('userEmail', txtEmail);
            window.location.replace('#/kotenOverzicht');
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode, errorMessage);
            document.getElementById('foutMelding').innerHTML = `${errorCode} - ${errorMessage}`;
          });

        firebase.database().ref('gebruikers').push({
          Voornaam: txtVoornaam,
          Achternaam: txtAchternaam,
          Straatnaam: txtStraatnaam,
          Huisnummer: nmrHuisnummer,
          Postcode: nmrPostcode,
          Stad: txtStad,
          Email: txtEmail,
          Telefoonnummer: nmrTelefoonnummer,
          userType: txtUserType,
          Campus: campus,
        });
      } else {
        document.getElementById('foutMelding').innerHTML = "De wachtwoorden zijn niet gelijk aan elkaar";
      }
    });
  } else {
    window.location.href = '#/kotenOverzicht';
  }
};
