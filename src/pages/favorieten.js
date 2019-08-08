// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/favorieten.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(Template)({ title, loading, posts }));

  const userEmail = localStorage.getItem('userEmail');

  if (userEmail != null) {
    // CLEAR LOCALSTORAGE BIJ BEGIN
localStorage.removeItem('favkeys');


// GET KEYS FROM FAVORITS
function read_key(){
  let raw = firebase.database().ref("favorits");
  raw.on("value", function(snapshot){
    let keys = new Array();
    let childSnapKey = new Array();
    snapshot.forEach(function (childSnapshot){
      const data = childSnapshot.val();
          if (data.name == localStorage.getItem('userEmail')) {
              console.log(data.key);
              console.log(childSnapshot.key);
              keys.push(data.key);
              childSnapKey.push(childSnapshot.key);
          }
    });
    console.log(keys);
    localStorage.setItem('favKeys', JSON.stringify(keys));
    localStorage.setItem('childSnapKey', JSON.stringify(childSnapKey));
    read_data();
  });
}
read_key();

// GET VALUES
function read_data(){
    document.getElementById('favorieten').innerHTML = "";
    let childSnapKey = JSON.parse(localStorage.getItem('childSnapKey'));
    let key = JSON.parse(localStorage.getItem('favKeys'));
    for (let i = 0; i < key.length; i++) {
    let raw = firebase.database().ref("koten/" + key[i]);
      raw.on("value", function(snapshot){
            const data = snapshot.val();
            console.log(data);
            let post_content = "<div><h3>" + data.gebouw + " - " + data.adres + "</h3><button id='" + key[i] + "' class='readmore-btn smallRedBtn'>Lees meer</button><button id='" + childSnapKey[i] + "' class='remove-btn smallRedBtn'>Verwijder favoriet</button></div>";
            document.getElementById('favorieten').innerHTML += post_content;
            renderButtons();
  });
}
}

// RENDER BUTTONS
function renderButtons() {
    let readMoreButton = document.querySelectorAll('.readmore-btn')
    for (let i = 0; i < readMoreButton.length; i++) {
        readMoreButton[i].addEventListener('click', readMore);
    }
    let removeButtons = document.querySelectorAll('.remove-btn');
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', remove);
    }
};

// DETAIL PAGE
function readMore(event){
  let key = event.currentTarget.id;
    localStorage.setItem('detail_key', key);
    window.location.href = '#/detailKot';
}

// DELETE FAVORIET
function remove(event) {
    let key = event.currentTarget.id;
    console.log(key);
    firebase.database().ref('favorits/' + key).remove();
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
