// TO DO
// IMG TOEVOEGEN

// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/tinder.handlebars');

export default () => {
// Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));

  if (localStorage.getItem('userEmail') != null) {

    const tinderLimiet = localStorage.getItem('tinderLimiet');
    if (tinderLimiet != null) {
      localStorage.removeItem('tinderLimiet');
    }

    // LOAD PROFILES
    const tinderProfiles = new Array();
    function data() {
      const raw = firebase.database().ref('koten');
      raw.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          data = childSnapshot.val();
          console.log(data);
          tinderProfiles.push(data);
        });
        console.log(tinderProfiles);
        localStorage.setItem('tinderProfiles', JSON.stringify(tinderProfiles));
        nextProfile();
      });
    }

    data();

    // LOAD NEW PROFILES
    let nul = 0;
    let active = '';

    function nextProfile() {
      if (nul < tinderProfiles.length) {
        const newPerson = JSON.parse(localStorage.getItem('tinderProfiles'));
        active = newPerson[nul];
        showProfile(active);
        nul++;
      } else {
        document.getElementById('kotenFout').innerHTML = 'ER ZIJN GEEN KOTEN MEER';
        localStorage.setItem('tinderLimiet', 'full');
      }
    }

    // NIEUW PROFIEL TONEN
    function showProfile(gegevens) {
      const type = gegevens.gebouw;
      const adres = gegevens.adres;
      const typeAdres = `${type} - ${adres}`;
      localStorage.setItem('typeAdres', typeAdres);
      document.getElementById('typeAdres').innerHTML = typeAdres;

      const oppervlakte = `${gegevens.oppervlakte} m²`;
      const verdiepingen = gegevens.verdiepingen;
      document.getElementById('oppVerdiep').innerHTML = `Oppervlakte: ${oppervlakte}, Verdiepingen ${verdiepingen}`;

      const prijs = gegevens.huurprijs;
      const waarborg = gegevens.waarborg;
      document.getElementById('geld').innerHTML = `Huurprijs €${prijs}; Waarborg: €${waarborg}`;
    }

    const like = new Array();
    const dislike = new Array();

    // LIKES
    document.getElementById('likeBtn').addEventListener('click', likeButton);
    function likeButton() {
      const tinderLimiet = localStorage.getItem('tinderLimiet');
      if (tinderLimiet === null) {
        const typeAdres = localStorage.getItem('typeAdres');
        like.push(typeAdres);
        nextProfile();
        localStorage.setItem('like', JSON.stringify(like));
        seeLikes();
      }
    }

    // DISLIKE
    document.getElementById('dislikeBtn').addEventListener('click', dislikeButton);
    function dislikeButton() {
      const tinderLimiet = localStorage.getItem('tinderLimiet');
      if (tinderLimiet === null) {
        const typeAdres = localStorage.getItem('typeAdres');
        dislike.push(typeAdres);
        nextProfile();
        localStorage.setItem('dislike', JSON.stringify(dislike));
        seeDislikes();
      }
    }

    function seeLikes() {
      document.getElementById('likeList').innerHTML = '';
      for (let i = 0; i < like.length; i++) {
        document.getElementById('likeList').innerHTML += `<li class='li_likes' id='${i}'>${like[i]}</li>`;
      }
    }

    // seeDislikes
    function seeDislikes() {
      document.getElementById('dislikeList').innerHTML = '';
      for (let i = 0; i < dislike.length; i++) {
        document.getElementById('dislikeList').innerHTML += `<li class='li_dislikes' id='${i}'>${dislike[i]}</li>`;
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
  } else {
    window.location.href = '#/login';
  }
};
