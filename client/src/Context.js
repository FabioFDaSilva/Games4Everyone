import axios from 'axios';
import {AxiosResponse} from 'axios';
import { useEffect, createContext, useState } from 'react';

export const myContext = createContext({});

export default function Context(props){
  const [userObject, setUserObject] = useState();

  useEffect(() =>{
    axios.get("http://localhost:5000/getuser", {withCredentials: true}).then((res) =>{
      console.log(res);
      if(res.data){
        console.log(res.data);
        setUserObject(res.data);
      }
    })
  }, [])
  return(
    <myContext.Provider value={userObject}>{props.children}</myContext.Provider>
  )
}