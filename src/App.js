import './assets/less/App.less';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import Article from './pages/Article';
import AboutMe from './pages/AboutMe';
import Header from './components/Header/Header'

function App() {
  return (
    <div className='app'>
      <Header></Header>
      <Switch>
        <Route path='/home'>
          <Home></Home>
        </Route>
        <Route path='/article'>
          <Article></Article>
        </Route>
        <Route path='/aboutMe'>
          <AboutMe></AboutMe>
        </Route>
        <Redirect to='/home'></Redirect>
      </Switch>
    </div>
  );
}

export default App;
