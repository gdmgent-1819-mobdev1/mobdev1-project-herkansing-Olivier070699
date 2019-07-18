/* eslint-disable no-inner-declarations */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/detailKot.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));

  if (localStorage.getItem('userEmail') != null) {
    if (localStorage.getItem('detail_key') != null) {
      // READ EIGEN KOTEN
      function read_data() {
        const key = localStorage.getItem('detail_key');
        const raw = firebase.database().ref(`koten/${key}`);
        raw.on('value', (snapshot) => {
          const data = snapshot.val();
          const post_content = `<div><h3>${data.gebouw} - ${data.adres}</h3><p><b>Huur: </b>€ ${data.huurprijs}/maand, <b>Waarborg: </b>€${data.waarborg}</p><ul><li><b>Oppervlakte: </b>${data.oppervlakte} m²</li><li><b>Verdiepingen: </b>${data.verdiepingen}</li><li><b>Toilet: </b>${data.toilet}</li><li><b>Sanitair: </b>${data.sanitair}</li><li><b>Keuken: </b>${data.keuken}</li><li><b>Bemeubeld: </b>${data.jameubelsnee}: ${data.meubilair}</li></ul><h3>Korte beschrijving</h3><p>${data.beschrijving}</p></div>`;
          document.getElementById('detail_blok').innerHTML = post_content;
          localStorage.setItem('verhuurder_name', data.eigenaar);
          const onderwerp = `${data.gebouw} - ${data.adres}`;
          localStorage.setItem('onderwerp', onderwerp);
        });
      }
      read_data();
    } else {
      window.location.href = '#/kotenOverzicht';
    }
    // BERICHTEN
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.addEventListener('click', () => {
      const bericht = document.getElementById('bericht').value;
      if (bericht != '') {
        const from = localStorage.getItem('huurder_name');
        const to = localStorage.getItem('verhuurder_name');
        const onderwerp = localStorage.getItem('onderwerp');
        console.log(`from: ${from}, to: ${to}, onderwerp: ${onderwerp}, je bericht: ${bericht}`);

        firebase.database().ref('berichten').push({
          from,
          to,
          onderwerp,
          bericht,
        });

        alert('Je berichten is verzonden');
        document.getElementById('bericht').value = '';
      } else {
        alert('Type een bericht');
      }
    });
  } else {
    window.location.href = '#/login';
  }
};
