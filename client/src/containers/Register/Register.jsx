import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from '../../components/Form/Form';
import Header from '../../components/Header/Header';
import {HOST_URL} from '../../config';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
const Register = () => {
    const [registerInfo, setRegisterInfo] = useState({name: '', username: '', password: ''});
    const {dispatch} = useContext(AuthContext);
    const history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${HOST_URL}/auth/signup`, registerInfo);
            console.log(res.data);
            dispatch({type: "LOGIN_SUCCESS", payload: res.data});
            history.push('/');
        } catch (err) {
            dispatch({type: "LOGIN_FAILURE", payload: err});
            console.log(err);
        }

    }

    const handleInputChange = (e) => {
        const name = e.target.name; 
        const value = e.target.value;
        setRegisterInfo({
            ...registerInfo, 
            [name]: value
        });
        
    }
    return (
        <div>
            <Header />
            <Form header="Register" handleSubmit={handleSubmit}>
                <div class="form-group row">
                    <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>
                    <div class="col-md-6">
                        <input id="name" type="text" class="form-control" name="name" required value={registerInfo.name} onChange={handleInputChange}></input>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="username" class="col-md-4 col-form-label text-md-right">Username</label>
                    <div class="col-md-6">
                        <input id="username" type="text" class="form-control" name="username" required value={registerInfo.username} onChange={handleInputChange}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>
                    <div class="col-md-6">
                        <input id="password" type="password" class="form-control" name="password" required autocomplete="current-password" value={registerInfo.password} onChange={handleInputChange}></input>
                    </div>
                </div>

                <div class="form-group row mb-0">
                    <div class="col-md-3 offset-md-6">
                        <button type="submit" class="btn btn-primary">
                            Register
                        </button>
                    </div>
                </div>
            </Form>
        </div>
        
    );
};

export default Register;