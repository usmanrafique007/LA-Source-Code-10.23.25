import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, ScrollView, TouchableOpacity } from 'react-native';
import {
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

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
import StorageProperty from '../../../constants/storage-property';
import { getAsyncStorageData } from '../../../constants/utils';

const VerifyOTP = ({ isVerifying, setIsVerifying }) => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('')
  const [timer, setTimer] = useState(60)
  const { pair, turnBulbOff, verifyEmail, register, loginTuya } = useTuyaServices();

  useEffect(() => {
    if (timer > -1) {
      let timeInterval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timeInterval)
    }
  }, [timer])

  const getEmail = async () => {

    const token = await getAsyncStorageData(StorageProperty.USER_TOKEN);
    const { uid } = JSON.parse(token);

    setEmail(uid)
    return uid
  }

  const handleVerifyEmail = () => {
    if (email) {
      verifyEmail(email).then((res) => {

        Toast(
          'Success',
          'OTP has been sent successfully',
          'success',
          'success',
        );
      }).catch((e) => {
        console.log(e);

        return Toast(
          'Error',
          e[0],
          'danger',
          'danger',
        );
      })
    }
  }
  useEffect(() => {
    getEmail()
  }, [])
  useEffect(() => {
    handleVerifyEmail()
  }, [email])

  async function handleRegister() {
    if (!otp && otp.length < 6) {
      return Toast(
        'Error',
        'Please Enter a 6 digits OTP',
        'danger',
        'danger',
      );
    }


    register(email, otp)
      .catch((error) => {
        Toast('Error', JSON.stringify(error.message), 'danger', 'danger', 3000);
        setIsVerifying(false);
      })
      .then(async (res) => {
        if (res) {
          loginTuya(email)
          setIsVerifying(true);

          Toast(
            'Success',
            'Successfully Login to Tuya.',
            'success',
            'success',
          );
        }

      })
      .finally(() => {


        // navigation.navigate('Home');
      });
  }





  return (
    <PairFormContainer>
      <ScrollView keyboardShouldPersistTaps='handled'>

        <PairFormChildWrapper>
          <InputText
            style={{
              height: responsiveScreenHeight(6),
            }}
            value={otp}
            placeholder="Enter OTP"
            placeholderTextColor="#A9A9A9"
            keyboardType={'number-pad'}
            onChangeText={(text) => setOtp(text)}
            onSubmitEditing={() =>
              setTimeout(() => {
                handleStartPair();
              }, 800)
            }
          />
        </PairFormChildWrapper>
        {timer > 0 ?
          <TimerText>You can Resend Code in {timer} seconds</TimerText>
          :
          <TouchableOpacity onPress={() => handleVerifyEmail()}>
            <ResendButton>Resend</ResendButton>
          </TouchableOpacity>}
        <PairFormChildWrapper

          style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }}>
          <SetButton
            onPress={() => {
              Keyboard.dismiss();
              handleRegister();
            }}>
            <ButtonText>VERIFY</ButtonText>
          </SetButton>
        </PairFormChildWrapper>
      </ScrollView>
    </PairFormContainer>
  );
};

export default VerifyOTP;

const PairFormChildWrapper = styled.View`
  border-radius: 5px;
  width: ${responsiveScreenWidth(80)};
`;

const TimerText = styled.Text`
  font-size: ${responsiveScreenFontSize(2)};
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.yellow};
  margin: auto;
  
  `

const PairFormContainer = styled.View`
  position: relative;
  width: 100%;
  padding: 0 ${scaleWidth(5)}px;
  margin-top: ${scaleHeight(10)}px;
`;
const ResendButton = styled.Text`
  font-size: ${responsiveScreenFontSize(2.5)};
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.yellow};
  margin: auto;
  text-decoration:underline
`;