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
  if (localStorage.getItem('userEmail') != null) {
    // READ KOTEN
    function read_data() {
      let raw = firebase.database().ref("koten");
      raw.on("value", function (snapshot) {
        document.getElementById('content').innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
          const data = childSnapshot.val();
          let inhoud = "";
          let post_content = "<div class='kot_overzicht'><h3>" + data.gebouw + " - " + data.adres + "</h3><p><b>Huur: </b>€ " + data.huurprijs + "/maand, <b>Waarborg: </b>€" + data.waarborg + ", <b>Oppervlakte: </b>" + data.oppervlakte + "m²</p><button id='" + childSnapshot.key + "' class='readmore-btn'>Lees meer</button><button id='" + childSnapshot.key + "' class='fav-btn'>Favoriet</button></div>";
          document.getElementById('content').insertAdjacentHTML('afterbegin', post_content);
        })
        renderButtons();
      })
    }

    read_data();


    // RENDER Buttons
    function renderButtons() {
      let readMoreButton = document.querySelectorAll('.readmore-btn')
      for (let i = 0; i < readMoreButton.length; i++) {
        readMoreButton[i].addEventListener('click', readMore);
      }
    };

    // DETAIL PAGE
    function readMore(event) {
      let key = event.currentTarget.id;
      localStorage.setItem('detail_key', key);
      window.location.href = '#/detailKot';
    }
  } else {
    window.location.href = '#/login';
  }
};