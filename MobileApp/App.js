import React from 'react';
import AppContainer from './AppContainer';

// redux imports
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

// socket initialization
const socket = io('http://192.168.43.195:500');

//server here is prefix which is going to invoke all the time socket is connected
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

// reducers
// below conversations id and userId is same
const reducers = (state = { conversations: {} }, action) => {
  switch (action.type) {
    case 'message':
      return { ...state, message: action.data };

    case 'users_online':
      const conversations = { ...state.conversations };
      const usersOnline = action.data;

      for (let i = 0; i < usersOnline.length; i++) {
        const userId = usersOnline[i].userId;
        if (!conversations[userId]) {
          // new user with no conversations
          conversations[userId] = {
            messages: [],
            userName: usersOnline[i].userName,
          };
        }
      }
      return { ...state, usersOnline, conversations };

    case 'self_user':
      return { ...state, selfUser: action.data };

    case 'private_message':
      const conversationId = action.data.conversationId;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...state.conversations[conversationId],
            messages: [
              action.data.message,
              ...state.conversations[conversationId].messages,
            ],
          },
        },
      };

    default:
      return state;
  }
};

// store createion with middleware and socketIo
const store = applyMiddleware(socketIoMiddleware)(createStore)(reducers);

//subscribing to store state, any update in store we will be notified
store.subscribe(() => {
  //console.log('new State', store.getState());
});

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}
