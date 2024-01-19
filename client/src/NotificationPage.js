import React from 'react'

function NotificationPage() {

    const notifications = JSON.parse(localStorage.getItem('notifications'));

    return (
        <div>
            {
                notifications?.map((obj, index) => {
                    return(
                        <div key={index}>
                            {
                                obj.seen == false ? 
                                <div className="card" style={{backgroundColor: "#ded8c1"}}>
                                    <div className="card-body">{obj.msg}</div>
                                </div> :
                                <div className="card">
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