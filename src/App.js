import './assets/less/App.less';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useLocation } from 'react-router';

import Home from './pages/Home';
import Article from './pages/Article';
import AboutMe from './pages/AboutMe';
import Examples from './pages/Examples';
import Header from './components/Header/Header';

const App = () => {
  const location = useLocation();
  const { pathname } = location;
  const header = pathname.includes('/examples') ? '' : <Header></Header>;

  return (
    <div className='app'>
      {header}
      <Switch>
        <Route path='/examples'>
          <Examples></Examples>
        </Route>
        <Route exact path='/home'>
          <Home></Home>
        </Route>
        <Route path='/article'>
          <Article></Article>
        </Route>
        <Route exact path='/aboutMe'>
          <AboutMe></AboutMe>
        </Route>
        <Redirect to='/home'></Redirect>
      </Switch>
    </div>
  );
};

export default App;
