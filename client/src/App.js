import { io } from "socket.io-client"
import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "./state/actions";

function App() {

  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notificationReducer);

  const navigate = useNavigate();
  const[socket, setSocket] = useState(); 
  const[val, setVal] = useState('')
  
  const loadNotifications = async(lastUpdatedDate) => {
    const req = await fetch(`http://localhost:3001/notifications/${lastUpdatedDate}`, {
      method : "GET",
      headers : {"Content-Type" : "Application/json"}
    })
    const res = req.json();
    return res;
  }

  useEffect(() => {
    setSocket(io("http://localhost:3001"));
  }, [])

  useEffect(() => {
    socket?.on("get", (obj) => {
      //console.log("notification : " + notifications);
      const copiedArray = Array.from(notifications);
      //console.log("coppied arry : " + copiedArray);
      copiedArray.push(obj);
      //console.log("pushed arry : " + copiedArray);
      dispatch(setNotifications({notifications : copiedArray}))
    })
  }, [socket])

  useEffect(() => {
    if(notifications.length > 0){
      loadNotifications(notifications[notifications.length - 1].dateCreated).then((res) => {
        if(res.data.length > 0){
          const copiedArray1 = Array.from(notifications);
          //console.log("coppied arry : " + copiedArray);
          const copiedArray2 = copiedArray1.concat(res.data);
          //console.log("pushed arry : " + copiedArray);
          dispatch(setNotifications({notifications : copiedArray2}))
            //dispatch(setNotifications({notifications : [...notifications, ...res.data]}))
        }
      })
    }
    else{
      loadNotifications(new Date(0)).then((res) => {
        if(res.data.length > 0)
          dispatch(setNotifications({notifications : res.data}));
      })
    }
  }, [])

  console.log(notifications);
  return (
    <div className="App">
      <button className="btn btn-primary" onClick={() => {navigate("/not")}}>Notification page</button>
      <hr/>
      <input type="text" placeholder="input" value={val} onChange={(e) => {setVal(e.target.value)}}/>
      <button onClick={() => {socket.emit("send", {msg : val})}}>send</button>
    </div>
  );
}

export default App;

//setNotifications(prevNotifications => [...prevNotifications, obj]);