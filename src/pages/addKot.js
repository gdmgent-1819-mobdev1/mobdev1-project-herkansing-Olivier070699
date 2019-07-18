// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

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
    let toevoegen = document.getElementById('kot_toevoegen');

    toevoegen.addEventListener('click', function () {
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
      let eigenaar = localStorage.getItem('name');

      if (gebouw != "" && adres != "" && huurprijs != "" && waarborg != "" && oppervlakte != "" && verdiepingen != "" && sanitair != "" && toilet != "" && keuken != "" && jameubelsnee != "") {
        firebase.database().ref("koten").push({
          gebouw: gebouw,
          adres: adres,
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
          eigenaar: eigenaar

        })
        alert(gebouw + ' werd toegevoegd');
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
        // notification
      }
    });
  } else {
    window.location.href = '#/login';
  }
};

// CHECK IF USER LOGIN & CHECK IF USER TYPE IS VERHUURDER
