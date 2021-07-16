import React, { useContext, useState, useEffect } from 'react';
import { Homepage } from './features/homepage/homepage';
import { StorePage } from './features/storePage/storepage';
import { LoginPage } from './features/loginPage/login';
import { Signup } from './features/signup/signup';
import { Cart } from './features/cart/cart';
import { ProfilePage } from './features/profile/profile';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, login, logout } from "./features/currentUser/currentUserSlice";
import { ItemPage } from './features/itemPage/itemPage';
import logo from "./resources/images/logo.png";
import { myContext } from './Context';
import axios from 'axios';
import {selectCurrentGames, updateGameList } from "./features/storePage/storepageSlice";
import { updateCart } from "./features/cart/cartSlice";


function App() {

  const dispatch = useDispatch();

  const tryLogout = async (e) => {
    e.preventDefault();
    axios.get("http://localhost:5000/auth/logout", {
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

  useEffect(async () => {
    if (localStorage.getItem("storeState")) {
      const parsedStoreStateGames = await  JSON.parse(localStorage.storeState);
      dispatch(updateGameList(parsedStoreStateGames));
    }

    if (userObject) {
      if (localStorage.getItem("cartState")) {
        const parsedStoreStateCart =await  JSON.parse(localStorage.cartState);
        dispatch(updateCart(parsedStoreStateCart));
      } else {
        dispatch(updateCart([]));
      }
    } else {
      dispatch(updateCart([]));
    }

  }, [userObject]);

  const isLoggedIn = (userObject) => {
    
    if (!userObject) {
      return (<NavLink exact to='/loginPage'><button>Login</button></NavLink>);
    }
    else {
      if (window.location.href === "http://localhost:3000/loginPage") {
        window.location = "http://localhost:3000";
      }
      return (
        <div>
          <NavLink exact to='/cart'><button>Cart</button></NavLink>
          <NavLink exact to="/profile"><button>Profile</button></NavLink>
          <NavLink exact to='/logout'><button onClick={tryLogout}>Logout</button></NavLink>
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
      const response = await fetch("http://localhost:5000/games", {
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
  
  const { storeState } = { storeState: currentDisplayedGames };
  localStorage.setItem('storeState', storeState);

  if(!userObject){
    if (window.location.href === "http://localhost:3000/cart") {
    window.location = "http://localhost:3000"
  }
  }
  
},[userObject])

  return (

    <BrowserRouter>
      <header>
        <img src={logo} alt="logo" />
        <nav>
          <div className="leftAlign">
            <NavLink exact to='/'><button>Home</button></NavLink>
            <NavLink exact to='/store'><button>Store</button></NavLink>
          </div>
          <div>
            <form id="searchfrm" onSubmit={onSubmitSearchForm} className="centerAlign">
              <input type="search" placeholder="Search For A Game Name" id="searchBar"></input>
              <button>Search</button>
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
    </BrowserRouter>
  )

}

export default App;
