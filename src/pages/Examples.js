import React from 'react';
import { Switch, Route } from 'react-router';

import CityInSky from './CityInSky';

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
      </Switch>
    </>
  );
};

export default Examples;
