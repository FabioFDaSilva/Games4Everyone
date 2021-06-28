import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom';
import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../currentUser/currentUserSlice";
import { current } from 'immer';





export const ProfilePage = () =>{
    return(
        <p>ProfilePage</p>
    )
}