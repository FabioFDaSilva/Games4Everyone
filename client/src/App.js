import React, { useContext, useState, useEffect } from 'react';
import { Homepage } from './features/homepage/homepage';
import { StorePage } from './features/storePage/storepage';
import { LoginPage } from './features/loginPage/login';
import { Signup } from './features/signup/signup';
import { Cart } from './features/cart/cart';
import { ProfilePage } from './features/profile/profile';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import './App.scss';
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, login, logout } from "./features/currentUser/currentUserSlice";
import { ItemPage } from './features/itemPage/itemPage';
import logo from "./resources/images/logo.png";
import { myContext } from './Context';
import axios from 'axios';
import {selectCurrentGames, updateGameList } from "./features/storePage/storepageSlice";
import { updateCart } from "./features/cart/cartSlice";

///Resources from FAwesome
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function App() {

  const dispatch = useDispatch();

  const tryLogout = async (e) => {
    e.preventDefault();
    axios.get("/auth/logout", {
      withCredentials: true
    }).then(res => {
      if (res.data === "Done") {
        window.location.href = "/"
      }
    })
  }


  const userObject = useContext(myContext);
  const currentUser = useSelector(selectCurrentUser);
  const currentDisplayedGames = JSON.stringify(useSelector(selectCurrentGames));

  useEffect( () => {
    if (localStorage.getItem("storeState")) {
      const parsedStoreStateGames =  JSON.parse(localStorage.storeState);
      dispatch(updateGameList(parsedStoreStateGames));
    }

    if (localStorage.getItem("cartState")) {
      const parsedStoreStateCart = JSON.parse(localStorage.cartState);
      dispatch(updateCart(parsedStoreStateCart));
    } 
    
  },[userObject]);

  const isLoggedIn = (userObject) => {
    
    if (!userObject) {
      return (<NavLink exact to='/loginPage'>Login</NavLink>);
    }
    else {
      if (window.location.href === "http://localhost:3000/loginPage") {
        window.location = "http://localhost:3000";
      }
      return (
        <div>
          <NavLink exact to='/cart'>Cart</NavLink>
          <NavLink exact to="/profile">Profile</NavLink>
          <NavLink exact to='/logout' onClick={tryLogout}>Logout</NavLink>
        </div>
      )
    }
  }

  const onSubmitSearchForm = async e => {
    e.preventDefault();
    try {
      const body = {
        "name": e.target[0].value
      }

      console.log(JSON.stringify(body));
      const response = await fetch("/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      console.log(result);
      if (result !== "No Items Found") {
        dispatch(updateGameList(result));
        window.location = "http://localhost:3000/store";
      }else{
        alert("No games found with that name");
      }
    } catch (err) {
      console.error(err.message);
    }
  
  
};
useEffect( () =>{
})

  return (

    <BrowserRouter>
    <div className="topContainer">
      <header>
        <img src={logo} alt="logo" />
        <nav>
          <div className="leftAlign">
            <NavLink exact to='/'>Home</NavLink>
            <NavLink exact to='/store'>Store</NavLink>
          </div>
          <div>
            <form id="searchfrm" onSubmit={onSubmitSearchForm} className="centerAlign">
              <input type="search" placeholder="Search For A Game Name" id="searchBar"></input>
              <button><FontAwesomeIcon icon={faSearch} /></button>
            </form>
          </div>
          <div className="rightAlign">
            {isLoggedIn(userObject)}
          </div>

        </nav>
      </header>
      <Switch>
        <Route path='/store'>
          <StorePage />
        </Route>
        <Route path='/loginPage'>
          <LoginPage />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/cart'>
          <Cart />
        </Route>
        <Route path="/items/:itemId" component={ItemPage} />
        <Route path='/profile'>
          <ProfilePage />
        </Route>
        {/* 
          <Route path = '/checkout'>
            <Checkout />
          </Route>
          */}

        <Route path=''>
          <Homepage />
        </Route>

      </Switch>
    </div>
    </BrowserRouter>
  )

}

export default App;
