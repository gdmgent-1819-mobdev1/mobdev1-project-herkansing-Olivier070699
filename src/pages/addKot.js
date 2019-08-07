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

      let straat = document.getElementById('straat').value;
      let huisnummer = document.getElementById('huisnummer').value
      let stad = document.getElementById('stad').value;
      let adres = straat + " " + huisnummer + ", " + stad;

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${adres}.json?access_token=${config.mapBoxToken}&cachebuster=1545662179740&autocomplete=true.json`)
      .then((response) => {
        return response.json();
      }).then((myJson) => {
        let data = myJson;
        localStorage.setItem('latLong', JSON.stringify(data));
        console.log(data);
      });
      addToFirebase();
    });

    function addToFirebase() {

      let latLong = JSON.parse(localStorage.getItem('latLong'));
      let latitude = JSON.stringify(latLong.features[0].center[0]);
      let longitude = JSON.stringify(latLong.features[0].center[1]);

      let gebouw = document.getElementById('type_gebouw').value;
      let straat = document.getElementById('straat').value;
      let huisnummer = document.getElementById('huisnummer').value
      let stad = document.getElementById('stad').value;
      let adres = straat + " " + huisnummer + ", " + stad;
      let huurprijs = document.getElementById('huurprijs').value;
      let waarborg = document.getElementById('waarborg').value;
      let oppervlakte = document.getElementById('oppervlakte').value;
      let verdiepingen = document.getElementById('verdiepingen').value;
      let toilet = document.getElementById('toilet').value
      let sanitair = document.getElementById('sanitair').value;
      let keuken = document.getElementById('keuken').value;
      let jameubelsnee = document.getElementById('jameubelsnee').value;
      let meubilair = document.getElementById('meubilair').value;
      let beschrijving = document.getElementById('beschrijving').value;
      let eigenaar = localStorage.getItem('userEmail');

      if (gebouw != "" && adres != "" && huurprijs != "" && waarborg != "" && oppervlakte != "" && verdiepingen != "" && sanitair != "" && toilet != "" && keuken != "" && jameubelsnee != "") {
        firebase.database().ref("koten").push({
          gebouw: gebouw,
          adres: adres,
          eigenaar: eigenaar,
          latitude: latitude,
          longitude: longitude,
          huurprijs: huurprijs,
          waarborg: waarborg,
          oppervlakte: oppervlakte,
          verdiepingen: verdiepingen,
          sanitair: sanitair,
          toilet: toilet,
          keuken: keuken,
          jameubelsnee: jameubelsnee,
          meubilair: meubilair,
          beschrijving: beschrijving,
          eigenaar: eigenaar,
        })

        function showNotification() {
          let notificationsEnabled = localStorage.getItem('notifications');
          if (notificationsEnabled === 'true') {
            let notification = new Notification('Toegevoegd!', {
              body: gebouw + ' werd toegevoegd',
              // icon: 'link',
            })
            setTimeout(function () { notification.close(); }, 5000);
          }
        }

        showNotification();

        document.getElementById('type_gebouw').value = "kot";
        document.getElementById('straat').value = "";
        document.getElementById('huisnummer').value = "";
        document.getElementById('stad').value = "";
        document.getElementById('huurprijs').value = "";
        document.getElementById('waarborg').value = "";
        document.getElementById('oppervlakte').value = "";
        document.getElementById('verdiepingen').value = "1";
        document.getElementById('toilet').value = "Privé";
        document.getElementById('sanitair').value = "Douche";
        document.getElementById('keuken').value = "prive";
        document.getElementById('jameubelsnee').value = "Ja";
        document.getElementById('meubilair').value = "";
        document.getElementById('beschrijving').value = "";
      } else {
        const notification = new Notification('Let op!', {
          body: 'Er zijn nog lege velden',
          // icon: 'link',
        });
        setTimeout(() => { notification.close(); }, 5000);
      }
    }
  } else {
    window.location.href = '#/login';
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
