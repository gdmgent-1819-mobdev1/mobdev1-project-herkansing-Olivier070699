// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';

// Import the update helper
import update from '../helpers/update';

// Import firebase
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Import the template to use
const mapTemplate = require('../templates/page-with-map.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';

  update(compile(mapTemplate)({ title, loading, posts }));

  const pointers = [];
  const ref = firebase.database().ref('koten');
  ref.on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const kot = childSnapshot.val();
      const pointer = {
        Longitude: kot.longitude,
        Latitude: kot.latitude,
        Gebouw: kot.gebouw,
        Prijs: kot.huurprijs,
        Adres: kot.adres,
      };
      pointers.push(pointer);
      console.log(pointer);
      generateCard();
    });
  });

  function generateCard() {
    if (config.mapBoxToken) {
      // eslint-disable-next-line no-unused-vars
      mapboxgl.accessToken = config.mapBoxToken;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [3.725, 51.05389],
        zoom: 12,
      });
      map.on('load', () => {
        pointers.forEach((pointer) => {
          new mapboxgl.Marker()
            .setLngLat([pointer.Latitude, pointer.Longitude])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<p> ${pointer.Gebouw} - ${pointer.Adres}</p><p>€${pointer.Prijs}/maand</p>`))
            .addTo(map);
        });
      });
      // Mapbox Markers
    } else {
      console.error('Mapbox will crash the page if no access token is given.');
    }
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
};
