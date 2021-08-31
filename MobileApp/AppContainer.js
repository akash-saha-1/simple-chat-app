import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ChatScreen from './Screens/ChatScreen';
import FriendListScreen from './Screens/FriendListScreen';
import JoinScreen from './Screens/JoinScreen';

const AppStack = createStackNavigator({
  Home: FriendListScreen,
  Chat: ChatScreen,
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Join: JoinScreen,
    },
    {
      initialRouteName: 'Join',
    }
  )
);
export default AppContainer;
