import { ActionSetSettings } from '../actions/types';

const initialState = {
    NbrPlate:"",
};

export default function(state = initialState, action ) {
    switch(action.type) {
        case ActionSetSettings:
            return {
                ...state,
                NbrPlate: action.payload.NbrPlate,
                Action: action.payload.Action
            }
        default: 
            return state;
    }
}