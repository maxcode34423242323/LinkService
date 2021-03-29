import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import { useRoutes } from './pages/routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/navbar';
import { Loader } from './components/Loader';

import 'materialize-css'

function App() {
  
  const {token, login, logOut, userId, ready} = useAuth();
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated);

  if (!ready){
    return <Loader/>
  }
  return (
    <AuthContext.Provider value={{token, login, logOut, userId, isAuthenticated}}>
      <Router>
        { isAuthenticated && <Navbar/> }
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
              
        
  );
}

export default App;
