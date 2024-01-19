export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";

export const setNotifications = (notifications) => {
    return {
        type: SET_NOTIFICATIONS,
        payload: notifications
    };
};