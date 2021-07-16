import {Route, Switch,NavLink} from 'react-router-dom'; 
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, login} from "../currentUser/currentUserSlice";
import {Signup} from '../signup/signup';
import { useContext } from 'react';
import { myContext } from '../../Context';
import './login.css';

export const LoginPage = () =>{
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");

    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const userObject = useContext(myContext);
    const handleUsernameChange = (e) =>{
        setName(e.target.value);
    }
    const handlePasswordChange = (e) =>{
        setPassword(e.target.value);
    }
    const tryLogin = async (e) =>{
        e.preventDefault();
        const user = {
            "username": name,
            "password": password
        }
        
        const response = await fetch("http://localhost:5000/auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify(user),
            credentials: 'include'
        });
        const toJson = await response.json();
        console.log(response);
        if(!response){
            alert("User not found");
        }
        if(dispatch(login(toJson))){
            window.open("http://localhost:3000/", "_self");
        }
        
    }

    const googleLogin = async(e) =>{
        e.preventDefault();
        window.open("http://localhost:5000/auth/google", "_self");
    }
    return(
        <div id = "loginFormContainer">
            <form onSubmit={tryLogin} id="loginForm">
                <p>Username:</p>
                <input type="text" name="username" value={name} onChange={handleUsernameChange}></input>
                <p>Password:</p>
                <input type="password" name="password" value={password} onChange={handlePasswordChange}></input><br />
                <button type="submit" id="loginButton">Login</button>
            </form>
                <p id="registerLink">Not registered? <NavLink exact to="/signup">Signup here</NavLink></p>
                <Switch>
                    <Route path ='/store'>
                        <Signup />
                    </Route>
                </Switch>

            <p id="registerLink"> Or log in with Google</p><button onClick={googleLogin} id="googleLogin">Google Login</button>
            <p id="registerLink">(Might need to contact me via email first so I can add you to the list of accepted emails for google login, blame google)</p>
            <p id="registerLink">(fabio.f.dasilva@hotmail.com)</p>
        </div>

    )
}