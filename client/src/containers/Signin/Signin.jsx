import React, {useContext, useState} from 'react';
import Form from '../../components/Form/Form';
import Header from '../../components/Header/Header';
import { HOST_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import { useHistory } from 'react-router-dom';
const Signin = () => {
    const [userInfo, setUserInfo] = useState({username: '', password: ''});
    const {dispatch} = useContext(AuthContext);
    const history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({type: "LOGIN_START"});
        try {
            const res = await axios.post(`${HOST_URL}/auth/signin`, userInfo);
            dispatch({type: "LOGIN_SUCCESS", payload: res.data});
            history.push('/');
        } catch (err) {
            dispatch({type: "LOGIN_FAILURE", payload: err});
        }


    }

    const handleInputChange = (e) => {
        const name = e.target.name; 
        const value = e.target.value;
        setUserInfo({
            ...userInfo, 
            [name]: value
        });
        
    }
    return (
        <div>
            <Header/>
            <Form header="Sign in" handleSubmit={handleSubmit}>
                <div class="form-group row">
                    <label for="username" class="col-md-4 col-form-label text-md-right">Username</label>
                    <div class="col-md-6">
                        <input id="username" type="text" class="form-control" name="username" required autofocus onChange={handleInputChange}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                    <div class="col-md-6">
                        <input id="password" type="password" class="form-control" name="password" required autocomplete="current-password" onChange={handleInputChange}></input>
                    </div>
                </div>

                <div class="form-group row mb-0">
                    <div class="col-md-3 offset-md-6">
                        <button type="submit" class="btn btn-primary">
                            Sign in
                        </button>
                    </div>
                </div>
            </Form>
        </div>

        
    );
};

export default Signin;