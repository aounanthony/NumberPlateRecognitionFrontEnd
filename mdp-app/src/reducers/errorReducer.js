import { ActionGetErrors } from '../actions/types';

const initialState = {};

export default function(state = initialState, action ) {
    switch(action.type) {
        case ActionGetErrors:
            return action.payload;
        default: 
            return state;
    }
}