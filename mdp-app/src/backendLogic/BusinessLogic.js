import axios from 'axios';
import { ActionGetErrors, ActionGetAllCameras, ActionSetSettings} from '../actions/types';

export const getCameras = () => dispatch => {
    axios.get('http://10.81.16.113:4000/camera/getAll')
            .then(res => {
                const cameras = res.data;
                dispatch(getAllCameras(cameras));
            })
            .catch(err => {
                dispatch({
                    type: ActionGetErrors,
                    payload: err.response.data
                });
            });
}


export async function surveilAll(settings)  {
    try{
        var result;
        if(settings.Action === "trackNumber" && settings.NbrPlate !== ""){
            result= await axios.post('http://10.81.16.113:4000/blacklist/getdetections', {NbrPlate:settings.NbrPlate});
        }
        else{
            result= await axios.get('http://10.81.16.113:4000/blacklist/getall');
        }
    return result.data;
    }catch(error) {
        throw error;      
    }
}

export const getAllCameras = cameras => {

    return {
        type: ActionGetAllCameras,
        payload: cameras
    }
}


export const postSettings = (settings) => dispatch => {
        if(settings.Action==="addNumber"){
            axios.post('http://10.81.16.113:4000/blacklist/', {NbrPlate:settings.NbrPlate}).then(res => {
                dispatch(updateSettings(settings));
            })
            .catch(err => {
                dispatch({
                    type: ActionGetErrors,
                    payload: err.response.data
                });
            });
        }
        else if(settings.Action==="removeNumber"){
            axios.post('http://10.81.16.113:4000/blacklist/rm', {NbrPlate:settings.NbrPlate}).then(res => {
                console.log('here')
                dispatch(updateSettings(settings));
            })
            .catch(err => {
                dispatch({
                    type: ActionGetErrors,
                    payload: err.response.data
                });
            });
        }
        else if(settings.Action==="removeAll"){
            axios.get('http://10.81.16.113:4000/blacklist/rmAll').then(res => {
                dispatch(updateSettings(settings));
            })
            .catch(err => {
                dispatch({
                    type: ActionGetErrors,
                    payload: err.response.data
                });
            });
        }
        else{
            dispatch(updateSettings(settings));
        }
        }


export const updateSettings = settings => {
    return {
        type: ActionSetSettings,
        payload: settings
    }
}