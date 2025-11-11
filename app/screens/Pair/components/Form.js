import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { stopConfig } from '@owowagency/react-native-tuya';

import styled from 'styled-components/native';
import {
  ButtonText,
  InputText,
  SetButton,
  ScreenContainer as DefaultScreenContainer,
} from '../../../styles/commonStyledComponents';
import { scaleHeight, scaleWidth } from '../../../styles/scales';

import { PairingLoader } from './PairingLoader';
import { Toast } from '../../../components/Globals/Toast';

import { useTuyaServices } from '../../../hooks/useTuyaServices';
import { IosWifiInput } from './IosWifiInput';
import { AndroidWifiInput } from './AndroidWifiInput';
import { useWifi } from '../hooks/useWifi';
import { useHomeId } from '../../../hooks/useHomeId';
import checkWifiBand from '../hooks/CheckWifiBand';

const Form = ({ isPairing, setIsPairing, navigation }) => {
  const [selectedWifiSsid, setSelectedWifiSsid] = useState();
  const [wifiPw, setWifiPw] = useState('');
  const { homeId, getHomeId } = useHomeId();
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const { pair, turnBulbOff } = useTuyaServices();
  const {
    wifiSsids,
    wifiSsid,
    getIosWifi,
    getAndroidWifi,
    handleSetWifi,
    setWifiSsid,
    connectWifi
  } = useWifi();
  const instructionSlides = [
    {
      subtitle: 'Keep the network stable.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Ensure that the Wi-Fi signal is good.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Power on the device.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Verify Wi-Fi password.',
      subtitleColor: '#fff',
    },
    {
      subtitle: 'Check if it is 2.4GHz Wi-Fi.',
      subtitleColor: '#fff',
    },
  ];

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getIosWifi();
    }

    if (Platform.OS === 'android') {
      getAndroidWifi();
    }
    if (!homeId) {
      getHomeId()
    }
  }, []);

  async function handleStartPair() {
    if (!((selectedWifiSsid ?? wifiSsid) && wifiPw)) {
      return Toast(
        'Error',
        'Complete the form to continue pairing.',
        'danger',
        'danger',
      );
    }

    if (await checkWifiBand() != "2.4 GHz") {
      return Toast(
        'Error',
        'Select 2.4GHz Wi-Fi Network and enter password.',
        'danger',
        'danger',
      );
    }

    try {
      setIsPairing(true);
      console.log("selectedWifiSsid", selectedWifiSsid);
      console.log("wifiSsid", wifiSsid);
      console.log("wifiPw", wifiPw);

      pair(selectedWifiSsid ?? wifiSsid, wifiPw)
        .then(async (res) => {
          console.log("pair res", res);
          if (res) {
            turnBulbOff('inactive');
            Toast(
              'Success',
              'Successfully connected bulb/s to LightAwake!',
              'success',
              'success',
            );
            navigation.navigate('Home');
          }

        })
        .catch((error) => {
          console.log(error, 'Pair Error');

          Toast('Error', JSON.stringify(error.message), 'danger', 'danger', 3000);
          setIsPairing(false);
        })
        .finally(() => {
          setIsPairing(false);
        });

    }
    catch (e) {
      setIsPairing(false);
      console.log("e.dfdsfdsfd", e);
      Toast('Error', JSON.stringify(e.message), 'danger', 'danger', 3000);

    }
  }

  const handleStopPair = () => {
    stopConfig();
    setIsPairing(false);
  };
  useEffect(() => {
    if (isPairing) {
      let interval = setInterval(() => {
        Toast('Error', 'Couldn`t connect, Try Again!', 'danger', 'danger', 3000);
        setIsPairing(false)
      }, 3000000)
      return () => clearInterval(interval)
    }
  }, [isPairing])
  if (isPairing) {
    return (
      <PairingLoader
        isPairing={isPairing}
        responsiveWidth={responsiveWidth}
        responsiveHeight={responsiveHeight}
        instructionSlides={instructionSlides}
        handleStopPair={handleStopPair}
      />
    );
  }

  return (
    <PairFormContainer>
      <ScrollView keyboardShouldPersistTaps='handled'>
        <PairFormChildWrapper>
          {Platform.OS === 'ios' ? (
            <IosWifiInput wifiSsid={wifiSsid} handleSetWifi={handleSetWifi} />
          ) : (
            <AndroidWifiInput
              wifiSsids={wifiSsids}
              wifiSsid={wifiSsid}
              setWifiSsid={setWifiSsid}
              handleSetWifi={handleSetWifi}
              setSelectedWifiSsid={setSelectedWifiSsid}
            />
          )}
        </PairFormChildWrapper>
        <PairFormChildWrapper>
          {/* <InputText
            style={{
              height: responsiveScreenHeight(6),
            }}
            value={wifiPw}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            onChangeText={(wifiPw) => setWifiPw(wifiPw)}
            onSubmitEditing={() =>
              setTimeout(() => {
                handleStartPair();
              }, 800)
            }
          /> */}
          <InputTextContainer>
            <TextInput
              secureTextEntry={isPasswordSecure}
              style={{
                height: responsiveScreenHeight(6),
                width: responsiveScreenWidth(67),


              }}
              value={wifiPw}
              onChangeText={(wifiPw) => setWifiPw(wifiPw)}
              placeholder="Password"
            />
            <TouchableWithoutFeedback
              onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
              <Icon
                source={
                  isPasswordSecure
                    ? require('../../../../assets/visibility.png')
                    : require('../../../../assets/invisible.png')
                }
              />
            </TouchableWithoutFeedback>
          </InputTextContainer>
        </PairFormChildWrapper>
        <PairFormChildWrapper
          style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }}>
          <SetButton
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                handleStartPair();
              }, 800)
            }}>
            <ButtonText>PAIR</ButtonText>
          </SetButton>
        </PairFormChildWrapper>
      </ScrollView>
    </PairFormContainer>
  );
};

export default Form;

const PairFormChildWrapper = styled.View`
  border-radius: 5px;
  width: ${responsiveScreenWidth(80)};
`;

const PairFormContainer = styled.View`
  // position: relative;
  width: 100%;
  padding: 0 ${scaleWidth(5)}px;
  margin-top: ${scaleHeight(10)}px;
  // background-color: red;
  // align-items: center;

`;
const InputTextContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: ${scaleWidth(5)}px;
  margin-left:${responsiveScreenWidth(3)};
  width: ${responsiveScreenWidth(79.5)};

`;
const Icon = styled.Image`
  width: ${responsiveScreenWidth(6.5)};
  height: ${responsiveScreenHeight(3)};
  margin-right: ${responsiveScreenWidth(3)};
`;