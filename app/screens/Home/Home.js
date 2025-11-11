import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, SafeAreaView, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { useTimeFormatContext } from '../../contexts/time-format.context';
import useTime from '../../hooks/useTime';
import styled from 'styled-components/native';
import {
  ClockBarContainer,
  Clock,
  PeriodContainer,
  PeriodText,
  IllustratedBackgroundImage,
} from '../../styles/commonStyledComponents';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../network/AxiosRequestHandler';
import SurveyPrompt from './components/SurveyPrompt';
import { useTimer } from './hooks/useTimer';
import GiftPrompt from './components/GiftPrompt';
import InformUserModal from '../../components/Modals/InformUserModal';
import BackgroundService from 'react-native-background-actions';
import { useAlarmSoundContext } from '../../contexts/alarm-sound.context';
import BulbModal from '../../components/Modals/BulbModal';
import AlarmPermissionModal from '../../components/Modals/AlarmPermissionModal';
import PrivacyModal from '../../components/Modals/PrivacyModal';
import { useActiveBulbs } from '../../hooks/useActiveBulbs';
import { useDevices } from '../Bulbs/hooks/useDevices';


const Home = ({ navigation, route }) => {
  const { timeFormat, setTimeFormat } = useTimeFormatContext();
  const { isDisableAlarm, setIsDisableAlarm, isPrivacyModalOpen, setIsPrivacyModalOpen } = useAlarmSoundContext();
  const { timer, hasAnsweredSurvey } = useTimer();
  const { timeToDisplay, period } = useTime(timeFormat);
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [promptSurvey, setPromptSurvey] = useState(false);
  const [promptGift, setPromptGift] = useState(false);
  const [informUserModal, setInformUserModal] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [bulbModal, setBulbModal] = useState(false);
  const [isLoading,setIsLoading]=useState(false)
  const [showPopUp, setShowPopUp] = useState();
  const [activeBulbs, {getActivatedDevices}] = useActiveBulbs();
  const [isRefresh, setIsRefresh] = useState(false);

  const {devices, loading, setLoading} = useDevices(
    isRefresh,
    setIsRefresh,
    route
  );

  React.useLayoutEffect(() => {
    const handleBackground = async () => {
      if (BackgroundService.isRunning()) {
        await BackgroundService.stop();
      }
    };
    handleBackground();
  }, []);
  const handleFormatIconPress = () => {
    setTimeFormat((prevFormat) => (prevFormat === '24' ? '12' : '24'));
  };
  const handleClockIconPress = () => {
    navigation.navigate('Alarms', { timeToDisplay, period });
  };
  const handleClockIconPressDisabled = () => {
    setShowPopUp(true);
  };
  const handleInfoIconPress = () => {
    navigation.navigate('About');
  };
  const handleBulbPress = () => {
    if(isLoggedIn){
      if(devices?.length > 0){
        navigation.navigate('Bulbs');
      }
      else{
        navigation.navigate('Pair');
      }
    }
    else{
      navigation.navigate('Auth')
    }

    // setBulbModal(true);
  };
  const handleIconPress = () => {
    isLoggedIn ? navigation.navigate('Store') : navigation.navigate('Auth');
  };
  const handleIsLoggedIn = (status) => {
    setIsLoggedIn(status);
  };
  async function verifyUser() {
    try {
      const data = {};
      const requestConfig = {
        data: data,
        method: method.post,
        url: `${connectionPath.auth.verifyUser}`,
      };
      const response = await AxiosRequestHandler(requestConfig);
      if (response) {
        handleIsLoggedIn(true);
      }
    } catch (error) {
      handleIsLoggedIn(false);
    }
  }
  // useEffect(() => {
  //   const settingsPermission = async () => {
  //     await Brightness.requestPermissionsAsync();
  //   };
  //   settingsPermission();
  // }, []);

  useEffect(() => {

    if (isFocused) {
      setIsLoading(true)
      verifyUser();
      getActivatedDevices();
      setTimeout(()=>{
        setIsLoading(false)
      },500)

    }

  }, [isLoggedIn, isFocused]);

  useEffect(() => {
    if (route.params != undefined) {
      setTimeout(() => {
        setPromptGift(true);
      }, 500);
    }
  }, [route.params]);

  useEffect(() => {
    if (new Date().getDate() == timer) {
      if (hasAnsweredSurvey == null) {
        setPromptSurvey(true);
      }
    }
  }, [timer]);


  return (
    <IllustratedBackgroundImage
      source={require('../../../assets/images/home-background.png')}
      resizeMode="cover">
      {isLoading&&<Overlay>
        <ActivityIndicator size={'large'} color={'#f3d449'}/>
      </Overlay>}
      <SafeAreaView>
        <ContentContainer>
          <TopBar>
            <TouchableOpacity onPress={handleFormatIconPress}>
              <IconImage
                source={
                  timeFormat === '24'
                    ? require('../../../assets/images/12-format-icon.png')
                    : require('../../../assets/images/24-format-icon.png')
                }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInfoIconPress}>
              <IconImage
                source={require('../../../assets/images/info-icon.png')}
              />
            </TouchableOpacity>
          </TopBar>
          <ClockBarContainer>
            <Clock>{timeToDisplay}</Clock>
            {period && (
              <PeriodContainer>
                <PeriodText active={period === 'AM'}>AM</PeriodText>
                <PeriodText active={period === 'PM'}>PM</PeriodText>
              </PeriodContainer>
            )}
          </ClockBarContainer>
          <BottomBar>
            <TouchableOpacity onPress={handleIconPress}>
              {isLoggedIn ? (
                <IconImage
                  source={require('../../../assets/images/store-icon.png')}
                />
              ) : (
                <IconImage
                  source={require('../../../assets/images/user-icon.png')}
                />
              )}
            </TouchableOpacity>
            {Boolean(isDisableAlarm) ? (
              <AlarmTouchable onPress={handleClockIconPress}>
                <ClockIcon
                  source={require('../../../assets/images/clock-icon.png')}
                />
              </AlarmTouchable>
            ) : (
              <AlarmTouchableDisabled onPress={handleClockIconPressDisabled}>
                <ClockIcon
                  source={require('../../../assets/images/clock-icon.png')}
                />
              </AlarmTouchableDisabled>
            )}
            <TouchableOpacity onPress={handleBulbPress}>
              <IconImage
                source={require('../../../assets/images/bulb-icon.png')}
              />
            </TouchableOpacity>
          </BottomBar>
        </ContentContainer>
      </SafeAreaView>
      <SurveyPrompt
        promptSurvey={promptSurvey}
        setPromptSurvey={setPromptSurvey}
        navigation={navigation}
      />
      <GiftPrompt
        promptGift={promptGift}
        setPromptGift={setPromptGift}
        informUserModal={informUserModal}
        setInformUserModal={setInformUserModal}
        isGuestUser={isGuestUser}
        setIsGuestUser={setIsGuestUser}
      />
      <InformUserModal
        informUserModal={informUserModal}
        setInformUserModal={setInformUserModal}
        greetings={'Gift received!'}
        message={
          isGuestUser
            ? 'Oops! It looks like you do not have an account with us. To be able to use the gift, you need to create an account.'
            : 'To check item you can visit the Store or go directly to the Alarm Settings.'
        }
        isGuestUser={isGuestUser}
        navigation={navigation}
      />
      <BulbModal
        isVisible={bulbModal}
        onClose={() => {
          setBulbModal(false);
        }}
        greetings={'Notice!'}
        buttonText={'Close'}
        navigation={navigation}
        message={
          'Sorry! We have temporarily disabled the connection bulb feature.'
        }
      />
      <AlarmPermissionModal
        message={'Please allow the “Alarm Permission” on your device. This allows the app to activate the alarms you set. If you deny this permission, you cannot use Light Awake.'}
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
        handlePopupState={(state) => {
          setIsDisableAlarm(state);
          navigation.navigate('Alarms', { timeToDisplay, period });
        }}
      />
      <PrivacyModal
        greetings={'🌟 Your Privacy Matters to Us at Light Awake! 🌟'}
        message={`Before we proceed, we'd like to inform you about how we handle your data with utmost care:
        Collecting to Enhance Experience: Light Awake uses this app image data to optimize user experience, ensuring a personalized and efficient service.
        Your Control: Your data stays under your control. We only collect limited app usage/image information with your explicit consent and for the stated purposes.
        By tapping 'Ok, you consent to this data collection and use. You can change your preferences anytime in settings or uninstall app.`}
        showPopUp={isPrivacyModalOpen === 'open'}
        navigation={navigation}
        setShowPopUp={setIsPrivacyModalOpen}
      />
    </IllustratedBackgroundImage>
  );
};
export default Home;
const ContentContainer = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TopBar = styled.View`
  width: 100%;
  padding-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const BottomBar = styled.View`
  width: 100%;
  padding-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const IconImage = styled.Image`
  width: 60px;
  height: 60px;
  margin: 0 32px;
`;
const AlarmTouchable = styled.TouchableOpacity`
  height: 140px;
  width: 140px;
  border-radius: 70px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.yellow};
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
`;
const AlarmTouchableDisabled = styled.TouchableOpacity`
  height: 140px;
  width: 140px;
  border-radius: 70px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
`;
const ClockIcon = styled.Image`
  height: 70px;
  width: 70px;
`;

const Overlay = styled.View`
  width: 100%;
  height:100%;
  flex:1;
  opacity:0.7;
  background-color: #000;
  align-items: center;
  justify-content:center;
  position: absolute;
  z-index: 9999
`;