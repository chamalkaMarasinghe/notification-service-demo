import React, { useEffect, useState } from 'react'

function NotificationPage() {

    const [notifications, setNotificatinos] = useState([]);

    useEffect(() => {
        localStorage.setItem('unseen', 0);
    })

    useEffect(() => {
        setNotificatinos(JSON.parse(localStorage.getItem('notifications')));
    }, []);

    const notificationReached = (msg) => {
        setNotificatinos(prevNotifications => {
            return prevNotifications.map((obj, index) => {
                if(obj.msg === msg)
                    obj.seen = true;
                return obj;
            });
        });
        localStorage.setItem('notifications', JSON.stringify(
            JSON.parse(localStorage.getItem('notifications')).map((obj, index) => {
                if(obj.msg === msg)
                    obj.seen = true;
                return obj;
            })
        ));
    }

    return (
        <div>
            {
                notifications?.map((obj, index) => {
                    return(
                        <div key={index}>
                            {
                                obj.seen == false ? 
                                <div className="card notification-card" style={{backgroundColor: "#d1e4f0"}} onClick={() => {notificationReached(obj.msg)}}>
                                    <div className="card-body">{obj.msg}</div>
                                </div> :
                                <div className="card notification-card">
                                    <div className="card-body">{obj.msg}</div>
                                </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default NotificationPage