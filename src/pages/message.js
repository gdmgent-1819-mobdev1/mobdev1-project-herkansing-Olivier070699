// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/message.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));

  if (localStorage.getItem('userEmail') != null) {
    // / EERSTE ZIN
    function first_message() {
      document.getElementById('firstConversation').innerHTML = '';
      const key = localStorage.getItem('messageKey');
      console.log(key);
      const raw = firebase.database().ref(`berichten/${key}`);
      raw.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data.bericht);
        const inhoud = '';
        const userType = localStorage.getItem('userType');

        if (userType === 'Kotbaas') {
          const post_content = `<p class='messageAnder'>${data.bericht}</p>`;
          document.getElementById('firstConversation').insertAdjacentHTML('afterbegin', post_content);
        } else if (userType === 'Student') {
          let post_content = "<p class='messageEigen'>" + data.bericht + "</p>";
          document.getElementById('firstConversation').insertAdjacentHTML('afterbegin', post_content);
        }

        localStorage.setItem('verhuurder', data.to);
        localStorage.setItem('huurder', data.from);
        
        
      });
      conversation();
    }
    first_message();

    // ANDERE BERICHTEN LEZEN
    function conversation() {
      const raw = firebase.database().ref('conversation');
      raw.on('value', (snapshot) => {
        document.getElementById('conversation').innerHTML = '';
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const huurder = localStorage.getItem('huurder');
          const verhuurder = localStorage.getItem('verhuurder');
          const userEmail = localStorage.getItem('userEmail');
          const inhoud = '';
          if (huurder == data.huurder && verhuurder == data.verhuurder) {
            if (data.sendedBy == userEmail) {
              const post_content = `<p class='messageEigen'>${data.bericht}</p>`;
              document.getElementById('conversation').insertAdjacentHTML('beforeend', post_content);
            } else {
              const post_content = `<p class='messageAnder'>${data.bericht}</p>`;
              document.getElementById('conversation').insertAdjacentHTML('beforeend', post_content);
            }
          }
        });
      });
    }

    // NIEUW BERICHT VERSTUREN
    const sendNewMessageBtn = document.getElementById('sendNewMessageBtn');
    sendNewMessageBtn.addEventListener('click', () => {
      const bericht = document.getElementById('newMessage').value;
      const verhuurder = localStorage.getItem('verhuurder');
      const huurder = localStorage.getItem('huurder');
      const userEmail = localStorage.getItem('userEmail');
      if (bericht != '') {
        firebase.database().ref('conversation').push({
          huurder,
          verhuurder,
          bericht,
          sendedBy: userEmail,
        });
      }
      document.getElementById('newMessage').value = '';
      first_message();
    });

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
