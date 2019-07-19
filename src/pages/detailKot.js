/* eslint-disable no-inner-declarations */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';

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
        const rawData = firebase.database().ref(`koten/${key}`);
        rawData.on('value', (snapshot) => {
          const data = snapshot.val();
          const post_content = `<div><h3>${data.gebouw} - ${data.adres}</h3><p><b>Huur: </b>€ ${data.huurprijs}/maand, <b>Waarborg: </b>€${data.waarborg}</p><ul><li><b>Oppervlakte: </b>${data.oppervlakte} m²</li><li><b>Verdiepingen: </b>${data.verdiepingen}</li><li><b>Toilet: </b>${data.toilet}</li><li><b>Sanitair: </b>${data.sanitair}</li><li><b>Keuken: </b>${data.keuken}</li><li><b>Bemeubeld: </b>${data.jameubelsnee}: ${data.meubilair}</li></ul><h3>Korte beschrijving</h3><p>${data.beschrijving}</p></div>`;
          document.getElementById('detail_blok').innerHTML = post_content;
          localStorage.setItem('adres', data.adres);
          localStorage.setItem('verhuurder_name', data.eigenaar);
          const onderwerp = `${data.gebouw} - ${data.adres}`;
          localStorage.setItem('onderwerp', onderwerp);

          read_image();
          map();
        });
      }
      read_data();

      function read_image() {
        const key = localStorage.getItem('detail_key');
        const raw = firebase.database().ref(`images/${key}`);
        raw.on('value', (snapshot) => {
          document.getElementById('images').innerHTML = '';
          snapshot.forEach((childSnapshot) => {
            const imgURL = childSnapshot.val();
            const inhoud = '';
            const img_content = `<img src="${imgURL.image}">`;
            document.getElementById('images').insertAdjacentHTML('afterbegin', img_content);
          });
        });
      }
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

    // MAP
    function map() {
      const adres = localStorage.getItem('adres');
      // Mapbox code
      if (config.mapBoxToken) {
        mapboxgl.accessToken = config.mapBoxToken;

        // eslint-disable-next-line no-undef
        const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
        mapboxClient.geocoding.forwardGeocode({
          query: adres,
          autocomplete: false,
          limit: 1,
        })
          .send()
          .then((response) => {
        if (response && response.body && response.body.features && response.body.features.length) {
          const feature = response.body.features[0];
 
          const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: feature.center,
            zoom: 10,
          });
          new mapboxgl.Marker()
            .setLngLat(feature.center)
            .addTo(map);
        }
      });
      } else {
        console.error('Mapbox will crash the page if no access token is given.');
      }
    }
  } else {
    window.location.href = '#/login';
  }
};
