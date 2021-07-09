import './App.css';
import Signin from './containers/Signin/Signin';
import Register from './containers/Register/Register';
import Chat from './containers/Chat/Chat';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
function App() {
  const {user} = useContext(AuthContext);
  console.log(user);
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          {user ? <Chat/> : <Signin/>}
        </Route>
        
        <Route path='/signin' exact>
          {/* <Signin/> */}
          {user ? <Redirect to="/"/> : <Signin/> }
        </Route>

        
        <Route path='/register' exact>
          {/* <Register/> */}
          {user ? <Redirect to="/"/>: <Register/>}
        </Route>
        
      </Switch>

    </Router>
  );
}

export default App;
