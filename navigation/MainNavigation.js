import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Auth from '../screens/Auth';
import Main from '../screens/Main';
import DebtDetail from '../screens/DebtDetail';
import TabIcon from '../components/TabIcon';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddDebt from '../screens/AddDebt';
import ViewAll from '../screens/ViewAll';
import ViewAllDebt from '../screens/ViewAllDebt';

const HomeStack = createNativeStackNavigator();
const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen options={{}} name="main" component={Main} />
      <HomeStack.Screen name="debtDetail" component={DebtDetail} />
      <HomeStack.Screen name="viewalldebt" component={ViewAllDebt} />
    </HomeStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'white',
          borderTopColor: 'transparent',
          height: 55,
        },
      }}>
      <Tab.Screen
        name="homeNavigator"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="home" size={35} focused={focused} />
          ),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="addDebt"
        component={AddDebt}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="add-box" size={35} focused={focused} />
          ),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="viewAll"
        component={ViewAll}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon name="timeline" size={35} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="auth" component={Auth} />
        <Stack.Screen name="tab" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
