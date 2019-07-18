/* eslint-disable no-inner-declarations */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/beherenKot.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));

  if (localStorage.getItem('userEmail') != null) {
    // READ EIGEN KOTEN
    function read_data() {
      const raw = firebase.database().ref('koten');
      raw.on('value', (snapshot) => {
        document.getElementById('beheren').innerHTML = '';
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const inhoud = '';
          let post_content = `<div><h3>${data.gebouw} - ${data.adres}</h3>`;
          if (data.eigenaar == localStorage.getItem('name')) {
            console.log(data);
            post_content += `<button id="${childSnapshot.key}" class="remove-btn">Remove</button><button id="${childSnapshot.key}" class="edit-btn">Edit post</button><button id="${childSnapshot.key}" class="image-btn">Add images</button><hr class="inter-post"></div>`;
            localStorage.setItem(childSnapshot.key, JSON.stringify(data));
          } else {
            post_content = '';
          }
          document.getElementById('beheren').insertAdjacentHTML('afterbegin', post_content);
        });
        renderEventListeners();
      });
    }

    function renderEventListeners() {
      // REMOVE
      const removeButtons = document.querySelectorAll('.remove-btn');
      for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', remove);
      }

      // EDIT
      const editButtons = document.querySelectorAll('.edit-btn');
      for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', edit);
      }

      // IMAGE
      const imageButtons = document.querySelectorAll('.image-btn');
      for (let i = 0; i < imageButtons.length; i++) {
        imageButtons[i].addEventListener('click', image);
      }
    }

    function edit(event) {
      document.getElementById('form').innerHTML = '';
      document.getElementById('form').style.display = 'block';
      const key = event.currentTarget.id;
      localStorage.setItem('updateKey', key);
      console.log(key);
      const raw = firebase.database().ref(`koten/${key}`);
      raw.on('value', (snapshot) => {
        const data = snapshot.val();
        document.getElementById('form').innerHTML = `<h3>Type gebouw</h3> <select id="type_gebouw"> <option value="kot">Kot</option> <option value="studio">Studio</option> <option value="appartement">Appartement</option> <option value="loft">Loft</option> </select> <h3>Adres</h3> <input value="${data.adres}" id="straat" type="text" placeholder="straatnaam"> <h3>Huurprijs per maand</h3> <input value="${data.huurprijs}" id="huurprijs" type="number" placeholder="prijs per maand"> <h3>Waarborg</h3> <input value="${data.waarborg}" id="waarborg" type="number" placeholder="waarborg"> <h3>Oppervlakte in m²</h3> <input value="${data.oppervlakte}" id="oppervlakte" type="number" placeholder="oppervlakte"> <h3>Aantal verdiepingen</h3> <select id="verdiepingen"> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5+">5+</option></select><h3>Toilet</h3> <select id="toilet"> <option value="Privé">Privé</option> <option value="Gemeenschappelijk">Gemeenschappelijk</option> <option value="Niet aanwezig">Niet aanwezig</option> </select><h3>Sanitar</h3> <select id="sanitair"> <option value="Douche">Douche</option> <option value="Bad">Bad</option> <option value="Bad & douche">Bad & douche</option> </select> <h3>Keuken</h3> <select id="keuken"> <option value="prive">Privé</option> <option value="gemeenschappelijk">Gemeenschappelijk</option> </select> <h3>Bemeubeld</h3><select id="jameubelsnee"> <option value="Ja">Ja</option> <option value="Nee">Nee</option> </select><input value="${data.meubilair}" id="meubilair" type="text" placeholder="aanwezig meubels"> <h3>Korte beschrijving</h3> <textarea value="" id="beschrijving" placeholder="Korte beschrijving"></textarea> <input id="kot_update" type="submit" value="Updaten">`;
        document.getElementById('beschrijving').value = data.beschrijving;
      });

      const updateBtn = document.getElementById('kot_update');
      updateBtn.addEventListener('click', () => {
        const gebouw = document.getElementById('type_gebouw').value;
        const adres = document.getElementById('straat').value;
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
        const eigenaar = localStorage.getItem('name');

        if (adres != '' && huurprijs != '' && waarborg != '' && oppervlakte) {
          document.getElementById('beheren').innerHTML = '';
          const key = localStorage.getItem('updateKey');
          firebase.database().ref(`koten/${key}`).update({

            gebouw,
            adres,
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
          read_data();
          alert(`${gebouw} werd geüpdate`);
          document.getElementById('form').style.display = 'none';
        } else {
          alert('Er zijn nog lege velden');
          read_data();
        }
      });
    }

    function remove(event) {
      const key = event.currentTarget.id;
      console.log(key);
      firebase.database().ref(`koten/${key}`).remove();
      read_data();
    }

    function image(event) {
      const key = event.currentTarget.id;
      document.getElementById('imageUpload').style.display = 'block';

      // UPLOAD IMAGE
      if (firebase) {
        const fileUpload = document.getElementById('image');
        let imagePath;
        let imgURL;
        fileUpload.addEventListener('change', (evt) => {
          if (fileUpload.value !== '') {
            const fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
            const storageRef = firebase.storage().ref(`images/${key}/${fileName}`);

            storageRef.put(evt.target.files[0]).then(() => {
              imagePath = `images/${key}/${fileName}`;

              const storeImage = firebase.storage().ref(imagePath);
              storeImage.getDownloadURL().then((url) => {
                imgURL = url;
              });
            });
          }
        });
      }
    }
    read_data();
    console.log(URL);
  } else {
    window.location.href = '#/login';
  }
};

// NOG CHECKEN ALS KOTBAAS IS
