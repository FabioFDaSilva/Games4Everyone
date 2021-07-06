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
    const tryLogin = async (e) =>{
        e.preventDefault();
        
        console.log(name);
        console.log(password);
        window.open("http://localhost:5000/auth/login", "_self");
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
                <input type="submit"></input>
                <p>Not registered? <NavLink exact to="/signup">Signup here</NavLink></p>
                <Switch>
                    <Route path ='/store'>
                        <Signup />
                    </Route>
                </Switch>
            </form>

            <button onClick={googleLogin}>GoogleLogin</button>
        </div>

    )
}