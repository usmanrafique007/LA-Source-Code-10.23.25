/* eslint-disable react-hooks/exhaustive-deps */
import {LogBox} from "react-native";
import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import { withIAPContext } from 'react-native-iap';
import FlashMessage from 'react-native-flash-message';

import PushNotification, { Importance } from 'react-native-push-notification';

import { ThemeProvider } from 'styled-components/native';
import { AlarmSoundContextProvider } from './app/contexts/alarm-sound.context';
import { SleepSoundContextProvider } from './app/contexts/sleep-sound.context';
import { AlarmTimeContextProvider } from './app/contexts/alarm-time.context';
import { DeviceBrightnessContextProvider } from './app/contexts/device-brightness.context';
import { TimeFormatContextProvider } from './app/contexts/time-format.context';
import { WakeUpContextProvider } from './app/contexts/wake-up.context';
import { BulbContextProvider } from './app/contexts/bulb.context';
import { theme } from './app/styles/theme';
import { storeAsyncStorageData } from './app/constants/utils';
import StorageProperty from './app/constants/storage-property';
import { useTuyaServices } from './app/hooks/useTuyaServices';
import { NetworkInfoProvider } from './app/components/Globals/ConnectionStatus';
import { BulbStatusProvider } from './app/components/Globals/BulbStatus';
import { PurchaseProvider } from './app/components/Globals/PurchaseContext';
import AppNavigator from './app/navigation/AppNavigator';
import {
  checkLocalNetworkAccess,
  requestLocalNetworkAccess,
} from '@generac/react-native-local-network-permission';
import useAppTrackingTransparency from "./app/hooks/useTrackingTransparency";

LogBox.ignoreLogs([
  "ViewPropTypes will be removed",
  "ColorPropType will be removed",
  ])

const App = () => {
  if (__DEV__) {
    global.XMLHttpRequest = global.originalXMLHttpRequest
      ? global.originalXMLHttpRequest
      : global.XMLHttpRequest;
    global.FormData = global.originalFormData
      ? global.originalFormData
      : global.FormData;

    fetch; // Ensure to get the lazy property

    if (window.__FETCH_SUPPORT__) {
      // it's RNDebugger only to have
      window.__FETCH_SUPPORT__.blob = false;
    } else {
      /*
       * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
       * If you're using another way you can just use the native Blob and remove the `else` statement
       */
      global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
      global.FileReader = global.originalFileReader
        ? global.originalFileReader
        : global.FileReader;
    }
  }
  const { loginTuya } = useTuyaServices();
  // const {checkConnection} =  checkConnectionStatus();

  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'lightawake-channel',
        channelName: 'LightAwake Channel',
        soundName: 'ping.mp3',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`),
    );
    if (Platform.OS === 'ios') {
      checkAndRequestLocalNetworkAccess()
    }
  }, []);

  const checkAndRequestLocalNetworkAccess = async () => {
    const isGranted = await checkLocalNetworkAccess();
    if (!isGranted) {
      await requestLocalNetworkAccess();
    }
  }

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    async function getDeviceId() {
      const deviceId = await DeviceInfo.getUniqueId();

      storeAsyncStorageData(StorageProperty.DEVICE_UNIQUE_ID, `${deviceId}`);
    }

    getDeviceId();
  }, []);

  useAppTrackingTransparency();

  return (
    <>
      <NetworkInfoProvider>
        <StatusBar barStyle="light-content" />
        <ThemeProvider theme={theme}>
          <PurchaseProvider>
            <BulbContextProvider>
              <TimeFormatContextProvider>
                <WakeUpContextProvider>
                  <AlarmSoundContextProvider>
                    <SleepSoundContextProvider>
                      <AlarmTimeContextProvider>
                        <DeviceBrightnessContextProvider>
                          <BulbStatusProvider>
                            <AppNavigator />
                          </BulbStatusProvider>
                        </DeviceBrightnessContextProvider>
                      </AlarmTimeContextProvider>
                    </SleepSoundContextProvider>
                  </AlarmSoundContextProvider>
                </WakeUpContextProvider>
              </TimeFormatContextProvider>
            </BulbContextProvider>
          </PurchaseProvider>
        </ThemeProvider>
        <FlashMessage position="top" animated hideOnPress autoHide />
      </NetworkInfoProvider>
    </>
  );
};

export default withIAPContext(App);
