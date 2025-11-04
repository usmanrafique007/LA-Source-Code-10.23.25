import { useState, useEffect } from 'react';

import DeviceInfo from 'react-native-device-info';
import {
  queryHomeList,
  createHome,
  dismissHome,
} from '@owowagency/react-native-tuya';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export function useHomeId() {
  const [homeId, setHomeId] = useState();
  const [deviceId, setDeviceId] = useState();


  async function getDeviceId() {
    const id = await DeviceInfo.getUniqueId();
    return id;
  }

  async function getHomeId() {
    const homeList = await queryHomeList();
    const deviceId = await getDeviceId();

    const home = homeList.find((home) => home.geoName === deviceId);

    if (home) {
      const { homeId } = home;
      console.log(homeId, 'home');

      setHomeId(homeId);
      setDeviceId(deviceId);
    } else {
      const result = await createHome({
        name: 'LightAwake',
        geoName: deviceId,
        lon: 0,
        lat: 0,
        rooms: ['LighAwake Room'],
      });

      if (result === 'success') {
        getHomeId();
      }
    }
    return home?.homeId
  }

  return { homeId, getHomeId, deviceId, getDeviceId };
}
