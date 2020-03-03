import axios from 'axios';
import { ActionGetErrors, ActionSetCurrentUser } from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';

export const registerUser = (user, history) => dispatch => {
    axios.post('http://10.81.16.113:4000/User/register', user)
            .then(res => history.push('/login'))
            .catch(err => {
                dispatch({
                    type: ActionGetErrors,
                    payload: err.response.data
                });
            });
}

export const loginUser = (user) => dispatch => {
    axios.post('http://10.81.16.113:4000/User/login', user)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                dispatch(setCurrentUser(decoded));
            })
            .catch(err => {
                dispatch({
                    type: ActionGetErrors,
                    payload: err.response.data
                });
            });
}

export const setCurrentUser = decoded => {
    return {
        type: ActionSetCurrentUser,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
}