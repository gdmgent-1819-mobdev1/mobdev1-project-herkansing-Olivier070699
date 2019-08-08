// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/berichtenOverzicht.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));

  if(localStorage.getItem('userEmail') != null){
  // GECONTACTEERDE KOTEN
  function read_data() {
    const raw = firebase.database().ref('berichten');
    raw.on('value', (snapshot) => {
      document.getElementById('berichten').innerHTML = '';
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const inhoud = '';
        const name = localStorage.getItem('userEmail');
        const userType = localStorage.getItem('userType');
        
        if (userType === 'Kotbaas') {
          if (data.to == name) {
            const post_content = `<div><h3>${data.from}</h3><p>${data.onderwerp}</p><button id='${childSnapshot.key}' class='readMessageBtn middleRedBtn'>Open chat</button></div>`;
            document.getElementById('berichten').insertAdjacentHTML('afterbegin', post_content);
          }
        } else if (userType === 'Student') {
          if (data.from == name) {
            const post_content = `<div><h3>${data.onderwerp}</h3><button id='${childSnapshot.key}' class='readMessageBtn middleRedBtn'>Open chat</button></div>`;
            document.getElementById('berichten').insertAdjacentHTML('afterbegin', post_content);
          }
        }
      });
      renderButtons();
    });
  }

  read_data();

  function renderButtons() {
    const readMessage = document.querySelectorAll('.readMessageBtn');
    for (let i = 0; i < readMessage.length; i++) {
      readMessage[i].addEventListener('click', fullConversation);
    }
  }

  function fullConversation(event) {
    const messageKey = event.currentTarget.id;
    localStorage.setItem('messageKey', messageKey);
    window.location.href = '#/message';
    }

    const userType = localStorage.getItem('userType');
    if (userType != null) {
      if (userType === 'Kotbaas') {
        document.getElementById('studentNav').style.display = 'none';
        // for
      } else if (userType === 'Student') {
        document.getElementById('addKot').style.display = 'none';
        document.getElementById('beheerKot').style.display = 'none';
      }
    }

    const navOpen = document.querySelector('.open');
    const navClose = document.querySelector('.close');
    const nav = document.getElementById('nav');
    const allNavigationEllements = document.querySelector('.navigation');

    navOpen.addEventListener('click', () => {
      navOpen.style.display = 'none';
      navClose.style.display = 'block';
      nav.style.display = 'block';
      allNavigationEllements.style.height = '100vh';
      allNavigationEllements.style.position = 'fixed';
    });

    navClose.addEventListener('click', () => {
      navOpen.style.display = 'block';
      navClose.style.display = 'none';
      nav.style.display = 'none';
      allNavigationEllements.style.height = 'auto';
      allNavigationEllements.style.position = 'relative';
    });
  } else {
    window.location.href = '#/login';
  }
};
