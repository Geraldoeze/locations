
import './App.css';
import { Routes, Route, Navigate } from 'react-router';
// import Users from './user/pages/Users';
// import Auth from './user/pages/Auth';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

// import NewPlace from './places/pages/NewPlaces';
import React, {Suspense} from 'react';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/UserPlaces'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {

  const { token, login, logout, userId } = useAuth();
  let routes;  
  
  if (token) {
    routes=(
      <React.Fragment>
       <Route path="/" 
          exact="true"
          element={<Users />}
        /> 
        <Route path="/places/new" 
          exact="true"
           element={<NewPlace />}
        />
        <Route path="/:userId/places"
          exact="true"
          element={
          <UserPlaces />
          }
        />
        <Route path="/places/:placeId"
          exact="true"
           element={<UpdatePlace />}
        />
        <Route path="*"
          exact="true" 
          element={
          <Navigate to="/" />
          }
        />
      </React.Fragment>
    )
  } else {
    routes = (
      <React.Fragment>
      <Route path="/" 
        exact="true"
        element={<Users />}
      /> 
      <Route path="/:userId/places"
        exact="true"
        element={
        <UserPlaces />
        }
      />
      <Route path="/auth"
        exact="true"
        element={
        <Auth />
        }
      />
      <Route path="*"
        exact="true" 
        element= {
        <Navigate to="/auth" />
        }
     />
      </React.Fragment>
    )
  }

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn: !!token, //The !! in from of token converts token to true if there's a value or data type
        token: token,
        userId: userId,
        login: login,
        logout: logout}}>
    <MainNavigation />
     <main>
     <Suspense fallback={<div className='center'> <LoadingSpinner /> </div>}>
       <Routes>
            {routes}
      </Routes>
      </Suspense>
     </main>
    </AuthContext.Provider>
  );
}

export default App;
