import { ActionGetAllCameras } from '../actions/types';

const initialState = {
    cameras:[],
};

export default function(state = initialState, action ) {
    switch(action.type) {
        case ActionGetAllCameras:
            return {
                ...state,
                cameras: action.payload
            }
        default: 
            return state;
    }
}