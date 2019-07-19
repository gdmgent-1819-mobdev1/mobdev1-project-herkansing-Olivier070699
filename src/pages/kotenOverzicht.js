// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/kotenOverzicht.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));
  const usermail = localStorage.getItem('userEmail');
  if (usermail != null) {
    // KEY USER
    function userKey() {
      const raw = firebase.database().ref('gebruikers');
      raw.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.Email == localStorage.getItem('userEmail')) {
            const userKey = childSnapshot.key;
            localStorage.setItem('userKey', userKey);
          }
        });
      }); 
    }
    userKey();


    // READ KOTEN
    function read_data() {
      const raw = firebase.database().ref('koten');
      raw.on('value', (snapshot) => {
        document.getElementById('content').innerHTML = '';
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const kotKey = childSnapshot.key;
          const ID = `image${kotKey}`;
          localStorage.setItem('kotKey', kotKey);
          const inhoud = '';
          const post_content = `<div class='kot_overzicht'><h3><span class="gebouw">${data.gebouw}</span> - ${data.adres}</h3><p><b>Huur: </b>€ <span class="huurprijs">${data.huurprijs}</span>/maand, <b>Waarborg: </b>€${data.waarborg}, <b>Oppervlakte: </b><span class="oppervlakte">${data.oppervlakte}</span>m²</p><figure id='${ID}'></figure><button id='${childSnapshot.key}' class='readmore-btn'>Lees meer</button><button id='${childSnapshot.key}' class='fav-btn'>Favoriet</button></div>`;
          document.getElementById('content').insertAdjacentHTML('afterbegin', post_content);
          read_image();
        });
        renderButtons();
      });
    }

    function read_image() {
      const kotKey = localStorage.getItem('kotKey');
      const raw = firebase.database().ref(`images/${kotKey}`);
      raw.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const imgURL = childSnapshot.val();
          const img_content = `<img src="${imgURL.image}">`;
          const ID = `image${kotKey}`;
          document.getElementById(ID).innerHTML = '';
          document.getElementById(ID).insertAdjacentHTML('afterbegin', img_content);
        });
      });
    }

    read_data();

    // RENDER Buttons
    function renderButtons() {
      const readMoreButton = document.querySelectorAll('.readmore-btn');
      for (let i = 0; i < readMoreButton.length; i++) {
        readMoreButton[i].addEventListener('click', readMore);
      }
      const favButton = document.querySelectorAll('.fav-btn');
      for (let i = 0; i < favButton.length; i++) {
        favButton[i].addEventListener('click', addToFav);
      }
    }

    // ADD TO FAVORITS
    function addToFav(event) {
      let key = event.currentTarget.id;
      let userKey = localStorage.getItem('userKey');
      let name = localStorage.getItem('userEmail');
      firebase.database().ref(`favorits/${userKey}`).push({
        key:key,
        name:name
      })
    }

    // DETAIL PAGE
    function readMore(event) {
      const key = event.currentTarget.id;
      localStorage.setItem('detail_key', key);
      window.location.href = '#/detailKot';
    }

    // Notification toestemming
    let notificationsEnabled = false;
    function initNotifications() {
      if (window.Notification) {
        Notification.requestPermission((permission) => {
          if (permission === 'granted') {
            notificationsEnabled = true;
            localStorage.setItem('notifications', notificationsEnabled);
            showNotification();
          } else {
            notificationsEnabled = false;
            localStorage.setItem('notifications', notificationsEnabled);
          }
        });
      }
    }

    initNotifications();

    function showNotification() {
      if (notificationsEnabled) {
        const notification = new Notification('Welcome', {
          body: 'text',
          // icon: 'link',
        });
        setTimeout(() => { notification.close(); }, 5000);
      }
    }

    // Filter gebouw
    const filterGebouw = document.getElementById('filterGebouw');
    filterGebouw.addEventListener('click', () => {
      reset();

      const koten = document.querySelectorAll('.kot_overzicht');
      const inputGebouw = document.getElementById('typeGebouw').value;
      const gebouwen = document.querySelectorAll('.gebouw');

      const inputMinPrijs = document.getElementById('minPrijs').value;
      const huurprijzen = document.querySelectorAll('.huurprijs');

      const inputMaxPrijs = document.getElementById('maxPrijs').value;

      let count = 0;
      gebouwen.forEach((gebouw) => {
        const typeGebouw = gebouw.innerHTML;
        if (inputGebouw != typeGebouw) {
          koten[count].style.display = 'none';
        }
        count += 1;
      });
    });

    // Prijs Filter
    document.getElementById('filterPrijs').addEventListener('click', () => {
      reset();
      const koten = document.querySelectorAll('.kot_overzicht');
      const inputMinPrijs = document.getElementById('minPrijs').value;
      const huurprijzen = document.querySelectorAll('.huurprijs');
      const inputMaxPrijs = document.getElementById('maxPrijs').value;
      let count = 0;

      huurprijzen.forEach((huurprijs) => {
        const prijs = huurprijs.innerHTML;
        if (inputMinPrijs != null && inputMaxPrijs != null) {
          if (inputMinPrijs < prijs && inputMaxPrijs > prijs) {
            koten[count].style.display = 'none';
            console.log('1');
          }
        } else if (inputMaxPrijs != null && inputMinPrijs == null) {
          if (inputMaxPrijs > prijs) {
            koten[count].style.display = 'none';
            console.log('2');
          }
        } else if (inputMaxPrijs == null && inputMinPrijs != null) {
          if (inputMinPrijs < prijs) {
            koten[count].style.display = 'none';
            console.log('3');
          }
        }
        count += 1;
      });
    });

    document.getElementById('filterOpp').addEventListener('click', () => {
      reset();
      const koten = document.querySelectorAll('.kot_overzicht');
      const oppervlaktes = document.querySelectorAll('.oppervlakte');
      const inputMinOpp = document.getElementById('minOpp').value;

      let count = 0;
      oppervlaktes.forEach((oppervlakte) => {
        const opp = oppervlakte.innerHTML;
        if (inputMinOpp > opp) {
          koten[count].style.display = 'none';
        }
        count += 1;
      });
    });

    // Reset Filter
    document.getElementById('resetFilter').addEventListener('click', reset);
    function reset() {
      const koten = document.querySelectorAll('.kot_overzicht');
      // Reset filter
      for (let i = 0; i < koten.length; i++) {
        koten[i].style.display = 'block';
      }
      document.getElementById('minPrijs').value = '';
      document.getElementById('maxPrijs').value = '';
      document.getElementById('minOpp').value = '';
    }
  } else {
    window.location.href = '#/login';
  }
};
