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
          if (data.eigenaar == localStorage.getItem('userEmail')) {
            console.log(data);
            post_content += `<button id="${childSnapshot.key}" class="remove-btn smallRedBtn">Remove</button><button id="${childSnapshot.key}" class="edit-btn smallRedBtn">Edit post</button><button id="${childSnapshot.key}" class="image-btn smallRedBtn">Add images</button><hr class="inter-post"></div>`;
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
        document.getElementById('form').innerHTML = `<label>Type gebouw</label> <select id="type_gebouw"> <option value="kot">Kot</option> <option value="studio">Studio</option> <option value="appartement">Appartement</option> <option value="loft">Loft</option> </select> <label>Adres</label> <input value="${data.adres}" id="straat" type="text" placeholder="straatnaam"> <label>Huurprijs per maand</label> <input value="${data.huurprijs}" id="huurprijs" type="number" placeholder="prijs per maand"> <label>Waarborg</label> <input value="${data.waarborg}" id="waarborg" type="number" placeholder="waarborg"> <label>Oppervlakte in m²</label> <input value="${data.oppervlakte}" id="oppervlakte" type="number" placeholder="oppervlakte"> <label>Aantal verdiepingen</label> <select id="verdiepingen"> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5+">5+</option></select><label>Toilet</label> <select id="toilet"> <option value="Privé">Privé</option> <option value="Gemeenschappelijk">Gemeenschappelijk</option> <option value="Niet aanwezig">Niet aanwezig</option> </select><label>Sanitar</label> <select id="sanitair"> <option value="Douche">Douche</option> <option value="Bad">Bad</option> <option value="Bad & douche">Bad & douche</option> </select> <label>Keuken</label> <select id="keuken"> <option value="prive">Privé</option> <option value="gemeenschappelijk">Gemeenschappelijk</option> </select> <label>Bemeubeld</label><select id="jameubelsnee"> <option value="Ja">Ja</option> <option value="Nee">Nee</option> </select><input value="${data.meubilair}" id="meubilair" type="text" placeholder="aanwezig meubels"> <label>Korte beschrijving</label> <textarea value="" id="beschrijving" placeholder="Korte beschrijving"></textarea><button class="bigRedBtn" id="kot_update">updaten</button>`;
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
        const eigenaar = localStorage.getItem('userEmail');

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

          const notificationsEnabled = localStorage.getItem('notifications');
          if (notificationsEnabled === 'true') {
            const notification = new Notification('Update!', {
              body: `${gebouw} werd geüpdate`,
              // icon: 'link',
            });
            setTimeout(() => { notification.close(); }, 5000);
          }

          document.getElementById('form').style.display = 'none';
        } else {
          
          const notificationsEnabled = localStorage.getItem('notifications');
          if (notificationsEnabled === 'true') {
            const notification = new Notification('Opgelet!', {
              body: 'Er zijn nog lege velden',
              // icon: 'link',
            });
            setTimeout(() => { notification.close(); }, 5000);
          }

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
        fileUpload.addEventListener('change', (evt) => {
          if (fileUpload.value !== '') {
            const fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
            const storageRef = firebase.storage().ref(`images/${key}/${fileName}`);

            storageRef.put(evt.target.files[0]).then(() => {
              imagePath = `images/${key}/${fileName}`;

              const storeImage = firebase.storage().ref(imagePath);
              storeImage.getDownloadURL().then((url) => {
                console.log(url);
                firebase.database().ref(`images/${key}`).push({
                  image: url,
                });
              });
            });
          }
        });
      }
    }
    read_data();

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
