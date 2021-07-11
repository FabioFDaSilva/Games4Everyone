import {Route, Switch,NavLink} from 'react-router-dom'; 
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, login} from "../currentUser/currentUserSlice";
import {Signup} from '../signup/signup';


export const LoginPage = () =>{
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");

    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
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
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include'
            
        });
        const toJson = await response.json();
        console.log(toJson);
        dispatch(login(toJson));
        console.log(currentUser);
    }

    const googleLogin = async(e) =>{
        e.preventDefault();
        window.open("http://localhost:5000/auth/google", "_self");
    }
    return(
        <div>
            <form onSubmit={tryLogin}>
                <p>Username:</p>
                <input type="text" name="username" value={name} onChange={handleUsernameChange}></input>
                <p>Password:</p>
                <input type="password" name="password" value={password} onChange={handlePasswordChange}></input><br />
                <button type="submit">Login</button>
            </form>
                <p>Not registered? <NavLink exact to="/signup">Signup here</NavLink></p>
                <Switch>
                    <Route path ='/store'>
                        <Signup />
                    </Route>
                </Switch>

            <button onClick={googleLogin}>GoogleLogin</button>
        </div>

    )
}