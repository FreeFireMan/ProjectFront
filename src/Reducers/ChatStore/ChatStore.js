import React from "react";
import io from 'socket.io-client'

export const CTX = React.createContext();

const initState = {
    general:[
        {from:'Stepan', msg: 'Hello!'},
        {from:'Stepan', msg: 'Hello!'},
        {from:'Oleh', msg: 'Hello!'}
    ],
    topic2:[
        {from:'Stepan', msg: 'Hello!'},
        {from:'Stepan', msg: 'Hello!'},
        {from:'Oleh', msg: 'Hello!'}
    ]
};

function reducer(state, action) {

    const {from, msg, topic} = action.payload;

    switch (action.type) {
        case 'RECEIVE_MESSAGE':
            return {
                ...state,
                [topic]: [
                    ...state[topic],
                    {from, msg}
                ]
            };
        default:
            return state
    }
}

let socket;

function sendAction(value){
    socket.emit('chat message', value);
}

export default function Store(props) {

    const [allChats, dispatch] = React.useReducer(reducer, initState);

    if(!socket){
        socket = io(':5000');
        socket.on('chat message', function (msg) {
            dispatch({type:'RECEIVE_MESSAGE', payload: msg});
        })
    }

    const user  = 'aaron' + Math.random(100).toFixed(2);

    return (
        <CTX.Provider value={{sendAction, allChats, user}}>
            {props.children}
        </CTX.Provider>
    )
}