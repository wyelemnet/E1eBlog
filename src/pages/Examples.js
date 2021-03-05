import React from 'react';
import { Switch, Route } from 'react-router';

import CityInSky from './CityInSky';
import Satellite from './Satellite';

const Examples = () => {
  return (
    <>
      <Switch>
        <Route exact path='/examples'>
          Examples
        </Route>
        <Route path='/examples/cityInSky'>
          <CityInSky></CityInSky>
        </Route>
        <Route path='/examples/satellite'>
          <Satellite></Satellite>
        </Route>
      </Switch>
    </>
  );
};

export default Examples;
