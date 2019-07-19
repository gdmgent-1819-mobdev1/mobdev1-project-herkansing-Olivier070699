// Pages
import HomeView from './pages/home';
// import AboutView from './pages/about';
// import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import LoginView from './pages/login';
import RegisterView from './pages/register';
import KotenOverzichtView from './pages/kotenOverzicht';
import TinderView from './pages/tinder';
import AddKotView from './pages/addKot';
import BeherenKotView from './pages/beherenKot';
import BerichtenOverzichtView from './pages/berichtenOverzicht';
import DetailKotView from './pages/detailKot';
import MessageView from './pages/message';
import LogoutView from './pages/logout';
import FavorietenView from './pages/favorieten';

export default [
  { path: '/', view: HomeView },
  // { path: '/about', view: AboutView },
  // { path: '/firebase', view: FirebaseView },
  { path: '/kaart', view: MapboxView },
  { path: '/login', view: LoginView },
  { path: '/register', view: RegisterView },
  { path: '/kotenOverzicht', view: KotenOverzichtView },
  { path: '/tinder', view: TinderView },
  { path: '/addKot', view: AddKotView },
  { path: '/beherenKot', view: BeherenKotView },
  { path: '/berichtenOverzicht', view: BerichtenOverzichtView },
  { path: '/detailKot', view: DetailKotView },
  { path: '/message', view: MessageView },
  { path: '/logout', view: LogoutView },
  { path: '/favorieten', view: FavorietenView },
];
