import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom';
import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../currentUser/currentUserSlice";
import { current } from 'immer';
import './signup.css';





export const Signup = () =>{
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [address, setAddress] = React.useState("");

    const currentUser = useSelector(selectCurrentUser);

    const handleUsernameChange = (e) =>{
        setName(e.target.value);
    }
    const handlePasswordChange = (e) =>{
        setPassword(e.target.value);
    }
    const handleAddressChange = (e) =>{
        setAddress(e.target.value);
    }
    const trySignup = async (e) =>{
        e.preventDefault();
        const user = {
            "username": name,
            "password": password,
            "address": address
        }
        const newUser = await fetch("http://localhost:5000/users", {
            method: "POST",
            body: JSON.stringify(user),
            headers:{
                "Content-Type" : "application/json"
            }
        })
        const response = await newUser.json();
        if (response.data){
            window.open("http://localhost:3000/", "_self");
        }else{
            alert("Username taken");
        }
    }
    return(
        <div id="signupFormContainer">
            <form onSubmit={trySignup} id="signupForm">
            <p>Username:</p>
            <input type="text" name="username" value={name} onChange={handleUsernameChange}></input>
            <p>Password:</p>
            <input type="password" name="password" value={password} onChange={handlePasswordChange}></input>
            <p>Your email address:</p>
            <input type="email" name="address" value={address} onChange={handleAddressChange}></input>
            <br />
            <input type="submit" id ="signupButton"></input>
        </form>
        </div>
        
    )
}