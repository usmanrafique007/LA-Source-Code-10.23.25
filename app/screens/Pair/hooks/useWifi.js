import {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import Geolocation from '@react-native-community/geolocation';
import {storeAsyncStorageData} from '../../../constants/utils';
import StorageProperty from '../../../constants/storage-property';

export function useWifi() {
  const [wifiSsids, setWifiSsids] = useState({});
  const [wifiSsid, setWifiSsid] = useState('');

  console.log(wifiSsid);

  const handleSetWifi = (ssid) => {
    setWifiSsid(ssid);
  };

  function requestLocationAuthorizationIos() {
    Geolocation.requestAuthorization();

    getIosWifi();
  }

  function getIosWifi() {
    WifiManager.getCurrentWifiSSID().then(
      (ssid) => {
        setWifiSsid(ssid);
        storeAsyncStorageData(StorageProperty.WIFI_NAME, `${ssid}`);
      },
      () => {
        setWifiSsid('');
      },
    );
  }

  async function requestLocationAuthorizationAndroid() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'LightAwake Access Location Permission',
        message:
          'Allow to LightAwake use Location Services information as needed.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    getAndroidWifi();
  }

  async function requestNotificationAuthorizationAndroid() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'Allow notification permissions for this app?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
      console.log('Notification permission denied');
    }
    getAndroidWifi();
  }
  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted.');
        // You can now write to external storage.
      } else {
        console.log('Storage permission denied.');
        // Handle the case where permission is denied.
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
    }
  }

  async function requestReadExternalStorageAndroid() {
    try {
      const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Read External Storage',
        message: 'Allow read external storage permissions for this app?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted.');
      } else {
        console.log('Storage permission denied.');
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
    }
    getAndroidWifi();
  }

  function getAndroidWifi() {
    WifiManager.loadWifiList().then((ssid) => {
      console.log("Wifi ssid", ssid);
      setWifiSsids(ssid);
      storeAsyncStorageData(StorageProperty.WIFI_NAME, `${ssid}`);
    }).catch((e) => {
      console.log("Wifi ssid error", e);
    });

    // workaround in case ssid is empty
    WifiManager.getCurrentWifiSSID().then((ssid) => {
      setWifiSsid(ssid);
      useEffect(() => {
        console.log('wifiSet')
        storeAsyncStorageData(StorageProperty.WIFI_NAME, `${ssid}`);
      }, []);
    });
  }

  function connectWifi(ssid,password){
      WifiManager.connectToProtectedWifiSSID({ssid, password,isWEP:false,isHidden:false,timeout:3000}).then(
        () => {
          console.log("Connected successfully!");
Promise.resolve(true)        

},
        () => {
          console.log("Connection failed!");
Promise.reject(false)        
        }
      );
  }

  return {
    wifiSsids,
    wifiSsid,
    requestNotificationAuthorizationAndroid,
    requestReadExternalStorageAndroid,
    requestStoragePermission,
    requestLocationAuthorizationIos,
    requestLocationAuthorizationAndroid,
    getIosWifi,
    getAndroidWifi,
    handleSetWifi,
    setWifiSsid,
    connectWifi
  };
}
