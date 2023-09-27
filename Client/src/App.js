// App.js

import React from 'react';
import Routers from './Routes';
import { AuthProvider } from './Components/AuthContext';
//import LoginForm from './LoginForm';

function App() {
  return (
    <AuthProvider>
      <Routers/>
    </AuthProvider>
  );
}

export default App;
