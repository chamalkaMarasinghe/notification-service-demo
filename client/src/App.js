import { io } from "socket.io-client"
import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  const[socket, setSocket] = useState(); 
  const[val, setVal] = useState('')
  const[unseen, setUnseen] = useState(0)
  
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
      const notifications = JSON.parse(localStorage.getItem('notifications'))
      if(notifications){
        notifications.push(obj);
        setUnseen(Number(localStorage.getItem('unseen')) + 1);
        localStorage.setItem('unseen', Number(localStorage.getItem('unseen')) + 1);
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
    })
  }, [socket])

  useEffect(() => {
    const notifications = JSON.parse(localStorage.getItem('notifications'));
    if(notifications && notifications.length > 0){
      loadNotifications(notifications[notifications.length - 1].dateCreated).then((res) => {
        setUnseen(Number(localStorage.getItem('unseen')) + res.data.length);
        localStorage.setItem('unseen', Number(localStorage.getItem('unseen')) + res.data.length);
        localStorage.setItem('notifications', JSON.stringify([...notifications, ...res.data]));
      })
    }else{
      loadNotifications(new Date(0)).then((res) => {
        setUnseen(res.data.length);
        localStorage.setItem('unseen', res.data.length);
        localStorage.setItem('notifications', JSON.stringify(res.data));
      })
    }
  }, [])

  console.log(JSON.parse(localStorage.getItem('notifications')));

  return (
    <div className="App">
      <button type="button" className="btn btn-primary" onClick={() => {navigate("/not")}}>
        Notifications <span className="badge bg-danger">{unseen != 0 ? unseen : ''}</span>
      </button>
      <hr/>
      <input type="text" placeholder="input" value={val} onChange={(e) => {setVal(e.target.value)}}/>
      <button onClick={() => {socket.emit("send", {msg : val})}}>send</button>
    </div>
  );
}
export default App;
//setNotifications(prevNotifications => [...prevNotifications, obj]);