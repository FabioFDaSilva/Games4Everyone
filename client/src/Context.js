import axios from 'axios';
import {AxiosResponse} from 'axios';
import {useDispatch, useSelector} from "react-redux";
import { useEffect, createContext, useState } from 'react';
import { login, logout, selectCurrentUser } from './features/currentUser/currentUserSlice';
export const myContext = createContext({});



export default function Context(props){
  const [userObject, setUserObject] = useState();
  useEffect(() =>{
    async function fetchData(){
      await axios.get("/getUser", {withCredentials: true}).then((res) =>{
      if(res.data){
        setUserObject(res.data);
      }else{
        if(localStorage.getItem("cartState")){
          localStorage.removeItem("cartState");
        }
        if (window.location.href === "http://localhost:3000/cart" || window.location.href === "http://localhost:3000/profile") {
          window.location = "http://localhost:3000"}
      }
    })
    }
    fetchData();
  }, [])
  return(
    <myContext.Provider value={userObject}>{props.children}</myContext.Provider>
  )
}