import {
  initActivator,
  send,
  getCurrentUser,
  loginWithEmail,
  logout,
  getHomeDetail,
  getRegisterEmailValidateCode,
  registerAccountWithEmail
} from '@owowagency/react-native-tuya';
import { useEffect, useState } from 'react';
import { useActiveBulbs } from './useActiveBulbs';
import { useHomeId } from './useHomeId';


export function useTuyaServices() {
  const [activeBulbs, { getActivatedDevices }] = useActiveBulbs();
  const { homeId, getHomeId } = useHomeId();

  useEffect(() => {
    async function fetch() {
      try {
        await getHomeId();
      }
      catch (e) {
        console.error(e)
      }
    }
    fetch();
  }, []);

  useEffect(() => {
    async function getActiveBulbs() {
      await getActivatedDevices();
    }
    getActiveBulbs();
  }, []);

  async function turnBulbOff(type) {
    try {
      if (type === 'inactive') {
        if (homeId) {
          const homeDetail = await getHomeDetail({ homeId: homeId }),
            { deviceList } = homeDetail;
          console.log(homeDetail, 'homeDetail');

          sendCommand(deviceList, false);
        }
      }

      sendCommand(activeBulbs, false);
    }
    catch (e) {
      console.error(e);

    }
  }

  async function turnBulbOn() {
    sendCommand(activeBulbs, true);
  }

  async function pair(wifiSsid, wifiPw) {
    let hID = await getHomeId()
    console.log(hID, 'home id');

    if (hID) {
      try {
        let res = await initActivator({
          homeId: hID,
          ssid: wifiSsid,
          password: wifiPw,
          time: 100,
          type: 'THING_EZ',
        });
      // console.log(res, 'pair response');


        return res;
      }
      catch (e) {
        console.error('pair error', e);
        throw new Error(e)
      }
    }
    else {
      return false
    }
  }

  async function sendCommand(bulbs, light) {
    for (let index = 0; index < bulbs.length; index++) {
      const bulb = bulbs[index];
      try {
        await send({
          devId: bulb.devId,
          command: {
            20: light,
          },
        });
      } catch (error) {
        await send({
          devId: bulb.devId,
          command: {
            20: light,
          },
        });
      }
    }
  }

  async function verifyEmail(email) {
    try {
      var result = await getRegisterEmailValidateCode({
        countryCode: '1',
        email: email,
      })
      console.log(result, 'RESult');

      return result
    }
    catch (e) {
      console.log('Registration Error', e);
      throw new Error(e)
    }

  }

  async function register(email, otp) {
    try {
      let result = await registerAccountWithEmail({
        countryCode: '1',
        email: email,
        password: 'Password',
        validateCode: otp,
      });

      console.log("result", result);

      return result;
    }
    catch (e) {
      console.log(e, 'Regiser result');

      throw new Error('Something went wrong!')
    }

  }

  async function logoutTuya() {
    try {
      const user = await getCurrentUser();
      // alert(user,'Tuya user');
      if (user) {
        const result = await logout();
        console.log('====================================');
        console.log('logging out ', result);
        console.log('====================================');
        return result

      }

    } catch (error) {
      throw new Error('Sothing Went Wrong!')
    }
  }

  async function loginTuya(email) {
    try {
      const user = await getCurrentUser();
      // alert(user,'Tuya user');
      if (user) {
        const result = await logout();
        console.log('====================================');
        console.log('logging out ', result);
        console.log('====================================');
      }

      const result = await loginWithEmail({
        countryCode: '1',
        email: email,
        password: 'Password',
      });
      await getHomeId()

      console.log('====================================');
      console.log('logging in ', result);
      console.log('====================================');
      return result
    } catch (error) {
      throw new Error('Login Failed')
    }
  }

  return { pair, turnBulbOn, turnBulbOff, loginTuya, verifyEmail, register, logoutTuya };
}
