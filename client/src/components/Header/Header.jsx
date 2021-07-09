import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = (props) => {
    const {user, dispatch} = useContext(AuthContext);
    const history = useHistory();
    const handleLogout = () => {
        dispatch({type: "LOGOUT"});
        history.push('/');
    }
    return (
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm justify-content-around">
            <div class="container">
                <a class="navbar-brand" href="/">
                    Safe Chat
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* Left side of navbar */}
                    {/* <ul class="navbar-nav mr-auto">

                    </ul> */}

                    {/* Right Side Of Navbar */}
                    <ul class="navbar-nav ml-auto">
                        {user ? 
                        <>
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {user.name}
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" onClick={handleLogout}>
                                        Log out
                                    </a>
                                </div>
                            </li>
                        </> : 
                        <>
                            <li class="nav-item">
                                <a class="nav-link" href="/signin">Sign in</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/register">Register</a>
                            </li>
                        </>}
                      

							
              
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;