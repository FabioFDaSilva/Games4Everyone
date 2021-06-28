import {Route, Switch,NavLink} from 'react-router-dom'; 
import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../currentUser/currentUserSlice";
import {Signup} from '../signup/signup';


export const LoginPage = () =>{
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");

    const currentUser = useSelector(selectCurrentUser);

    const handleUsernameChange = (e) =>{
        setName(e.target.value);
    }
    const handlePasswordChange = (e) =>{
        setPassword(e.target.value);
    }
    const tryLogin = (e) =>{
        e.preventDefault();
        console.log(name);
        console.log(password);
    }
    return(
        <form onSubmit={tryLogin}>
            <p>Username:</p>
            <input type="text" name="username" value={name} onChange={handleUsernameChange}></input>
            <p>Password:</p>
            <input type="password" name="password" value={password} onChange={handlePasswordChange}></input><br />
            <input type="submit"></input>
            <p>Not registered? <NavLink exact to="/signup">Signup here</NavLink></p>
            <Switch>
                <Route path ='/store'>
                    <Signup />
                </Route>
            </Switch>
        </form>
    )
}