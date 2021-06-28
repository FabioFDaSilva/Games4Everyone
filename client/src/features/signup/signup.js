import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom';
import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../currentUser/currentUserSlice";
import { current } from 'immer';





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
    const trySignup = (e) =>{
        e.preventDefault();
        console.log(name);
        console.log(password);
        console.log(address);
    }
    return(
        <form onSubmit={trySignup}>
            <p>Username:</p>
            <input type="text" name="username" value={name} onChange={handleUsernameChange}></input>
            <p>Password:</p>
            <input type="password" name="password" value={password} onChange={handlePasswordChange}></input>
            <p>Your email address:</p>
            <input type="email" name="address" value={address} onChange={handleAddressChange}></input>
            <br />
            <input type="submit"></input>
        </form>
    )
}