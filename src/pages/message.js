// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const Template = require('../templates/message.handlebars');

export default () => {
  // Data to be passed to the template
  const loading = true;
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
    update(compile(Template)({ title, loading, posts }));
    
    if(localStorage.getItem('userEmail') != null){
    // EERSTE ZIN
function first_message(){
    document.getElementById('firstConversation').innerHTML = "";
    let key = localStorage.getItem('messageKey');
    console.log(key);
    let raw = firebase.database().ref("berichten/" + key);
    raw.on("value", function(snapshot){
        const data = snapshot.val();
        console.log(data.bericht);
        let inhoud = "";
        let post_content = "<p class='messageEigen'>" + data.bericht + "</p>";
        localStorage.setItem('verhuurder', data.to);
        document.getElementById('firstConversation').insertAdjacentHTML('afterbegin', post_content);    
    })
    conversation();
  }
  first_message();
  
  // ANDERE BERICHTEN LEZEN
  function conversation(){
    let raw = firebase.database().ref("conversation");
    raw.on("value", function(snapshot){
      document.getElementById('conversation').innerHTML ="";
      snapshot.forEach(function (childSnapshot){
        const data = childSnapshot.val();
        let huurder = localStorage.getItem('huurder_name');
        let verhuurder = localStorage.getItem('verhuurder');
        let inhoud = "";
        if (huurder == data.huurder && verhuurder == data.verhuurder) {
          if(data.sendedBy == huurder){
            let post_content = "<p class='messageEigen'>" + data.bericht + "</p>";
            document.getElementById('conversation').insertAdjacentHTML('beforeend', post_content);
          }else{
            let post_content = "<p class='messageAnder'>" + data.bericht + "</p>";
            document.getElementById('conversation').insertAdjacentHTML('beforeend', post_content);
          } 
        }
      })
    })
  }
  
  conversation();
  
  // NIEUW BERICHT VERSTUREN
  let sendNewMessageBtn = document.getElementById('sendNewMessageBtn');
  sendNewMessageBtn.addEventListener('click', function(){
    let bericht = document.getElementById('newMessage').value;
    let verhuurder = localStorage.getItem('verhuurder');
    let huurder = localStorage.getItem('huurder_name');
      if (bericht != "") {
        firebase.database().ref("conversation").push({
          huurder,
          verhuurder,
          bericht,
          sendedBy: huurder
        })
      }
      document.getElementById('newMessage').value="";
      document.getElementById('conversation').innerHTML = "";
      first_message();
  })
    } else {
        window.location.href = '#/login';
}
};
