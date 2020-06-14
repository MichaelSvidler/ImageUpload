import React from 'react';
import Auth from 'containers/Auth/Auth';
import {Route, Switch } from 'react-router-dom';

import ImageUploder from 'containers/ImageUploder/ImageUploder';

function App() {
  return (
    <>
    <Switch>
        <Route path= "/upload" component={ImageUploder} />
        <Route path= "/login" component={Auth} />
        <Route path= "/" component={Auth} />  
    </Switch>
    </>
  
  );
}

export default App;
