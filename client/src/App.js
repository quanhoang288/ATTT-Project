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
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
// import { createSignalProtocolManager, SignalServerStore } from './signal/SignalGateway';

function App() {
  const {user} = useContext(AuthContext);
  // const signalServer = new SignalServerStore();
  // const [signalProtocolManagerUser, setSignalProtocolManagerUser] = useState(null);
  console.log(user);

  // const handleLoginSuccess = async (user) => {
  //   const signalProtocolManagerUser = await createSignalProtocolManager(user._id, signalServer);
  //   setSignalProtocolManagerUser(signalProtocolManagerUser);
  // }

  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          {user ? <Chat /> : <Signin/>}
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
