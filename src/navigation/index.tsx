import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './../screens/Home';
import ChatScreen from './../screens/Chat';
import CartScreen from './../screens/Cart';
import ProfileScreen from './../screens/Profile';
import {cart, chat, home, profile} from '../assets/index';
import {Image, StyleSheet} from 'react-native';
const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = home;
            } else if (route.name === 'Chat') {
              iconName = chat;
            } else if (route.name === 'Cart') {
              iconName = cart;
            } else if (route.name === 'Profile') {
              iconName = profile;
            }

            return (
              <Image
                source={iconName}
                style={{tintColor: color, width: size, height: size}}
              />
            );
          },
          tabBarActiveTintColor: '#3fac53',
          tabBarInactiveTintColor: 'gray',
        })}
        initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;


const styles = StyleSheet.create({
    tabBar: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: "white",
      borderRadius: 20,
      height: 70,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderTopWidth: 0,
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      width: 24,
      height: 24,
      resizeMode: "contain",
    },
    indicator: {
      width: 30,
      height: 4,
      backgroundColor: "#3fac53",
      borderRadius: 2,
      marginTop: 4,
    },
  });