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
            userType();
          }
        });
      });
    }
    userKey();

    function userType() {
      const userKey = localStorage.getItem('userKey');
      const raw = firebase.database().ref(`gebruikers/${userKey}`);
      raw.on('value', (snapshot) => {
        const data = snapshot.val();
        const userType = data.userType;
        localStorage.setItem('userType', userType);
      });
    }


    // READ KOTEN
    function read_data() {
      const userType = localStorage.getItem('userType');
      const raw = firebase.database().ref('koten');
      raw.on('value', (snapshot) => {
        document.getElementById('content').innerHTML = '';
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const kotKey = childSnapshot.key;
          const ID = `image${kotKey}`;
          localStorage.setItem('kotKey', kotKey);
          const inhoud = '';
          if (userType == 'Kotbaas') {
            const post_content = `<div class='kot_overzicht'><figure id='${ID}'></figure><h3><span class="gebouw">${data.gebouw}</span> - ${data.adres}</h3><p><b>Huur: </b>€ <span class="huurprijs">${data.huurprijs}</span>/maand, <b>Waarborg: </b>€${data.waarborg}, <b>Opp: </b><span class="oppervlakte">${data.oppervlakte}</span>m²</p><button id='${childSnapshot.key}' class='readmore-btn middleRedBtn'>Lees meer</button></div>`;
            document.getElementById('content').insertAdjacentHTML('afterbegin', post_content);
          } else {
            const post_content = `<div class='kot_overzicht'><figure id='${ID}'></figure><h3><span class="gebouw">${data.gebouw}</span> - ${data.adres}</h3><p><b>Huur: </b>€ <span class="huurprijs">${data.huurprijs}</span>/maand, <b>Waarborg: </b>€${data.waarborg}, <b>Opp: </b><span class="oppervlakte">${data.oppervlakte}</span>m²</p><button id='${childSnapshot.key}' class='readmore-btn smallRedBtn'>Lees meer</button><button id='${childSnapshot.key}' class='fav-btn smallRedBtn'>Favoriet</button></div>`;
            document.getElementById('content').insertAdjacentHTML('afterbegin', post_content);
          }
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
      const childSnapKey = new Array();
      const raw = firebase.database().ref('favorits');
      raw.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const child = data.key;
          if (data.name == localStorage.getItem('userEmail')) {
            childSnapKey.push(child);
          }
        });
      });

      const key = event.currentTarget.id;
      console.log(key);
      if (childSnapKey.includes(key) == false) {
        const name = localStorage.getItem('userEmail');
        firebase.database().ref('favorits').push({
          key,
          name,
        });
      }
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
    const filterGebouw = document.getElementById('typeGebouw');
    filterGebouw.addEventListener('change', () => {
      const koten = document.querySelectorAll('.kot_overzicht');
      const inputGebouw = document.getElementById('typeGebouw').value;
      const gebouwen = document.querySelectorAll('.gebouw');

      let count = 0;
      gebouwen.forEach((gebouw) => {
        const typeGebouw = gebouw.innerHTML;
        if (inputGebouw === '') {
          koten[count].style.display = 'block';
        } else if (inputGebouw != typeGebouw) {
          koten[count].style.display = 'none';
        }
        count += 1;
      });
    });

    // Filter min prijs
    const filterMinPrijs = document.getElementById('minPrijs');
    filterMinPrijs.addEventListener('change', () => {
      const inputMinPrijs = document.getElementById('minPrijs').value;
      const huurprijzen = document.querySelectorAll('.huurprijs');
      const koten = document.querySelectorAll('.kot_overzicht');

      let count = 0;
      huurprijzen.forEach((huurprijs) => {
        const prijs = huurprijs.innerHTML;
        if (inputMinPrijs > prijs) {
          koten[count].style.display = 'none';
        }
        count += 1;
      });
    });

    // Filter maxprijs
    const filterMaxPrijs = document.getElementById('maxPrijs');
    filterMaxPrijs.addEventListener('change', () => {
      const inputMaxPrijs = document.getElementById('maxPrijs').value;
      const huurprijzen = document.querySelectorAll('.huurprijs');
      const koten = document.querySelectorAll('.kot_overzicht');

      let count = 0;
      huurprijzen.forEach((huurprijs) => {
        const prijs = huurprijs.innerHTML;
        if (inputMaxPrijs < prijs) {
          koten[count].style.display = 'none';
        }
        count += 1;
      });
    });

    // Filter oppervlakte
    const filterOpp = document.getElementById('minOpp');
    filterOpp.addEventListener('change', () => {
      const minOpp = document.getElementById('minOpp').value;
      const oppervlaktes = document.querySelectorAll('.oppervlakte');
      const koten = document.querySelectorAll('.kot_overzicht');

      let count = 0;
      oppervlaktes.forEach((oppervlakte) => {
        const opp = oppervlakte.innerHTML;
        if (minOpp > opp) {
          koten[count].style.display = 'none';
        }
        count += 1;
      });
    });

    // Reset Filter
    document.getElementById('resetFilter').addEventListener('click', reset);
    function reset() {
      const koten = document.querySelectorAll('.kot_overzicht');

      for (let i = 0; i < koten.length; i++) {
        koten[i].style.display = 'block';
      }
      document.getElementById('minPrijs').value = '';
      document.getElementById('maxPrijs').value = '';
      document.getElementById('minOpp').value = '';
    }

    const type = localStorage.getItem('userType');
    if (type != null) {
      if (type === 'Kotbaas') {
        document.getElementById('studentNav').style.display = 'none';
        // for
      } else if (type === 'Student') {
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
