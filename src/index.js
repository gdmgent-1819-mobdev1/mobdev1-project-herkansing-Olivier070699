import Navigo from 'navigo';
import handlebars, { compile } from 'handlebars';
import './styles/main.sass';

import routes from './routes';

// Partials
const header = require('./partials/header.handlebars');
const footer = require('./partials/footer.handlebars');
const navigation = require('./partials/navigation.handlebars');

// Register the partial components
handlebars.registerPartial('header', compile(header)({ title: 'Just another web app' }));
handlebars.registerPartial('footer', compile(footer)({ text: 'Template made with love by GDM Ghent' }));
handlebars.registerPartial('navigation', compile(navigation));

// Router logic to load the correct template when needed
const router = new Navigo(window.location.origin, true);

routes.forEach((route) => {
  router.on(route.path, () => {
    route.view();
    router.updatePageLinks();
  });
});

// This catches all non-existing routes and redirects back to the home
router.notFound(() => {
  router.navigate('/');
});
router.resolve();
window.onload = () => {
  document.onclick = (e) => {
    // e.preventDefault();
    const target = e.target.getAttribute('href');
    if (target != null) {
      router.navigate(target);
    }
  };
};


// FIXEN  Nav
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
