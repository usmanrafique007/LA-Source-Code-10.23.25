/* eslint-disable react-hooks/exhaustive-deps */
import 'react-native-gesture-handler';
import * as React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import About from './../screens/About/About';
import Alarms from './../screens/Alarms/Alarms';
import FreeAlarm from './../screens/Alarms/FreeAlarm/_index';
import FreeAlarmSettings from './../screens/Alarms/FreeAlarm/Settings/_index';
import FreeWakeUpInformation from './../screens/WakeUpInformations/FreeWakeUpInformation/index';
import UpgradeAlarm from './../screens/Alarms/UpgradeAlarm/_index';
import UpgradeAlarmSettings from './../screens/Alarms/UpgradeAlarm/Settings/_index';
import FreeSleep from './../screens/Sleeps/FreeSleep/FreeSleep';
import UpgradeSleep from './../screens/Sleeps/UpgradeSleep/UpgradeSleep';
// import UpgradeWakeupArtOption from './../screens/Alarms/UpgradeAlarm/Settings/UpgradeWakeupArtOption';
// import UpgradeWakeUpInformation from './../screens/Alarms/UpgradeAlarm/UpgradeWakeUpInformation';
import Home from './../screens/Home/Home';
import Splash from './../screens/Splash/Splash';
import Pair from './../screens/Pair/Pair';
import Bulbs from './../screens/Bulbs/index';
import Bulb from './../screens/Bulb/Bulb';
import Store from './../screens/Store/Store';
import Auth from './../screens/Auth/index';
import ResetPassword from './../screens/ForgotPassword/ResetPassword';
import CheckMail from './../screens/ForgotPassword/CheckMail';
import VerifyCodeFromEmail from './../screens/ForgotPassword/VerifyCodeFromEmail';
import UpdatePassword from './../screens/ForgotPassword/UpdatePassword';
import UserProfileSettings from './../screens/User/UserProfileSettings';
import EditUserProfileSettings from './../screens/User/EditUserProfileSettings';
import Survey from './../screens/Survey/index';
import Notice from '../screens/Notice/Notice';
import FreeSleepIOS from '../screens/Sleeps/FreeSleep/FreeSleepIOS';
import UpgradeSleepIOS from '../screens/Sleeps/UpgradeSleep/UpgradeSleepIOS';

const Stack =
  Platform.OS === 'ios' ? createStackNavigator() : createNativeStackNavigator();

const fadeTransition = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const AppNavigator = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animationEnabled: true,
            headerShown: false,
          }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              cardStyleInterpolator: fadeTransition,
            }}
          />
          <Stack.Screen name="Survey" component={Survey} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Notice" component={Notice} />
          <Stack.Screen name="Alarms" component={Alarms} />
          <Stack.Screen name="FreeAlarm" component={FreeAlarm} />
          <Stack.Screen
            name="FreeAlarmSettings"
            component={FreeAlarmSettings}
          />
          <Stack.Screen name="FreeSleep" component={FreeSleep} />
          <Stack.Screen
            name="FreeInformation"
            component={FreeWakeUpInformation}
          />
          <Stack.Screen name="UpgradeAlarm" component={UpgradeAlarm} />
          <Stack.Screen
            name="UpgradeAlarmSettings"
            component={UpgradeAlarmSettings}
          />
          
          {/* <Stack.Screen
            name="WakeupArtOption"
            component={UpgradeWakeupArtOption}
          /> */}
          <Stack.Screen name="UpgradeSleep" component={UpgradeSleep} />
          {/* <Stack.Screen
            name="UpgradeInformation"
            component={UpgradeWakeUpInformation}
          /> */}
          <Stack.Screen name="Pair" component={Pair} />
          <Stack.Screen name="Bulbs" component={Bulbs} />

          <Stack.Screen name="Bulb" component={Bulb} />
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="CheckMail" component={CheckMail} />
          <Stack.Screen
            name="VerifyCodeFromEmail"
            component={VerifyCodeFromEmail}
          />
          <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
          <Stack.Screen
            name="UserProfileSettings"
            component={UserProfileSettings}
          />
          <Stack.Screen
            name="EditUserProfileSettings"
            component={EditUserProfileSettings}
          />
          <Stack.Screen name="Store" component={Store} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
