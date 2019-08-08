// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import config from '../config';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/addKot.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));

  if (localStorage.getItem('userEmail') != null) {
    // TOEVOEGEN AAN FIREBASE
    const toevoegen = document.getElementById('kot_toevoegen');
    toevoegen.addEventListener('click', () => {
      const straat = document.getElementById('straat').value;
      const huisnummer = document.getElementById('huisnummer').value;
      const stad = document.getElementById('stad').value;
      const adres = `${straat  } ${  huisnummer  }, ${  stad}`;

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${adres}.json?access_token=${config.mapBoxToken}&cachebuster=1545662179740&autocomplete=true.json`)
        .then((response) => response.json()).then((myJson) => {
          const data = myJson;
          localStorage.setItem('latLong', JSON.stringify(data));
          console.log(data);
        });
      addToFirebase();
    });

    function addToFirebase() {
      const latLong = JSON.parse(localStorage.getItem('latLong'));
      const latitude = JSON.stringify(latLong.features[0].center[0]);
      const longitude = JSON.stringify(latLong.features[0].center[1]);

      const gebouw = document.getElementById('type_gebouw').value;
      const straat = document.getElementById('straat').value;
      const huisnummer = document.getElementById('huisnummer').value;
      const stad = document.getElementById('stad').value;
      const adres = `${straat  } ${  huisnummer  }, ${  stad}`;
      const huurprijs = document.getElementById('huurprijs').value;
      const waarborg = document.getElementById('waarborg').value;
      const oppervlakte = document.getElementById('oppervlakte').value;
      const verdiepingen = document.getElementById('verdiepingen').value;
      const toilet = document.getElementById('toilet').value;
      const sanitair = document.getElementById('sanitair').value;
      const keuken = document.getElementById('keuken').value;
      const jameubelsnee = document.getElementById('jameubelsnee').value;
      const meubilair = document.getElementById('meubilair').value;
      const beschrijving = document.getElementById('beschrijving').value;
      const eigenaar = localStorage.getItem('userEmail');

      if (gebouw != '' && adres != '' && huurprijs != '' && waarborg != '' && oppervlakte != '' && verdiepingen != '' && sanitair != '' && toilet != '' && keuken != '' && jameubelsnee != '') {
        firebase.database().ref('koten').push({
          gebouw,
          adres,
          eigenaar,
          latitude,
          longitude,
          huurprijs,
          waarborg,
          oppervlakte,
          verdiepingen,
          sanitair,
          toilet,
          keuken,
          jameubelsnee,
          meubilair,
          beschrijving,
          eigenaar,
        });

        function showNotification() {
          const notificationsEnabled = localStorage.getItem('notifications');
          if (notificationsEnabled === 'true') {
            const notification = new Notification('Toegevoegd!', {
              body: `${gebouw  } werd toegevoegd`,
              // icon: 'link',
            });
            setTimeout(() => { notification.close(); }, 5000);
          }
        }

        showNotification();

        document.getElementById('type_gebouw').value = 'kot';
        document.getElementById('straat').value = '';
        document.getElementById('huisnummer').value = '';
        document.getElementById('stad').value = '';
        document.getElementById('huurprijs').value = '';
        document.getElementById('waarborg').value = '';
        document.getElementById('oppervlakte').value = '';
        document.getElementById('verdiepingen').value = '1';
        document.getElementById('toilet').value = 'Privé';
        document.getElementById('sanitair').value = 'Douche';
        document.getElementById('keuken').value = 'prive';
        document.getElementById('jameubelsnee').value = 'Ja';
        document.getElementById('meubilair').value = '';
        document.getElementById('beschrijving').value = '';
      } else {
        const notification = new Notification('Let op!', {
          body: 'Er zijn nog lege velden',
          // icon: 'link',
        });
        setTimeout(() => { notification.close(); }, 5000);
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
