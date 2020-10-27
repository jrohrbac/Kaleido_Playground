import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/register", userData)
        .then(res => history.push("/login")) // re-direct to login on successful register
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - get user token
export const loginUser = userData => dispatch => {
    console.log('userData' + JSON.stringify(userData));
    axios
        .post("/api/users/login", userData)
        .then(res => {
            // Save to local storage
            // Set token to local storage
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const uploadImage = userData => dispatch => {
    console.log('userData' + JSON.stringify(userData));
    axios
        .post("/api/users/uploadImage", userData)
        .then(res => {
            alert('Updated successfully!');
            console.log('success uploading');
            //const { info } = res.data;
        })
        .catch(err => {
            console.log(err.response);
            alert('An error occurred! Try submitting again.');
        });
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local localStorage
    localStorage.removeItem("jwtToken");
    // Remove auth ehader for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};
