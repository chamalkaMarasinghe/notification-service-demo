import React from 'react'
import { useSelector } from 'react-redux'

function NotificationPage() {

    const { notifications } = useSelector(state => state.notificationReducer);

    return (
        <div>
            {
                notifications.map((obj, index) => {
                    return(
                        <div key={index}>
                            <div className="card">
                                <div className="card-body">{obj.msg}</div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default NotificationPage