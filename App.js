import React from 'react';
import {AuthProvider} from './src/pages/main/AuthProvider';
import Router from './src/pages/Router';
const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;
