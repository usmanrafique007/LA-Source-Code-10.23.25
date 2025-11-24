import React, { useState, useEffect } from 'react';
import {
  Linking,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  BackHandler,
} from 'react-native';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import Sound from 'react-native-sound';

import * as Brightness from 'expo-brightness';
import { useKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import BackgroundService from 'react-native-background-actions';

import useTime from '../../../hooks/useTime';
import useAppState from '../hooks/useAppState';
import useNotify from '../hooks/useNotify';
import { useTuyaServices } from '../../../hooks/useTuyaServices';
import { formatTo24hFormat, formatTo12hFormat } from '../../../constants/utils';

import { useTimeFormatContext } from '../../../contexts/time-format.context';
import { useDeviceBrightnessContext } from '../../../contexts/device-brightness.context';

import styled from 'styled-components/native';
import { scaleWidth } from '../../../styles/scales';
import {
  IllustratedBackgroundImage,
  ClockBar,
} from '../../../styles/commonStyledComponents';
import { useAlarmSoundContext } from '../../../contexts/alarm-sound.context';
import { pulseSettings } from '../../../constants/available-settings';
import { useWakeUpContext } from '../../../contexts/wake-up.context';

const FreeSleep = ({ route, navigation }) => {
  useKeepAwake();
  const { timeFormat } = useTimeFormatContext();
  const { timeToDisplay, period, nowDateInMiliseconds } = useTime(timeFormat);
  const { alarmSound, alarmSoundEnabled, startSound } = useAlarmSoundContext();
  const { readyToChangeBrightness, restoreDeviceBrightnessWhenAppIsReady } =
    useDeviceBrightnessContext();
  const { appStateVisible } = useAppState();
  const { notify, reminderAlert } = useNotify();
  const { turnBulbOff } = useTuyaServices();
  const [isScrensaverActive, setIsScreensaverActive] = useState(false);
  const [displayTurnOffMessage, setDisplayTurnOffMessage] = useState(false);
  const isFocused = useIsFocused();

  // Torch Light States
  const [torchIsFlashing, setTorchIsFlashing] = useState(false);
  const { flashlightPulseRate, flashlightPulseRateEnabled } = useWakeUpContext();

  const { adjustedAlarmDateInMiliseconds } = route.params;
  const alarmDate = new Date(adjustedAlarmDateInMiliseconds);
  alarmDate.setSeconds(0);
  const alarmHours = alarmDate.getHours();
  const alarmMinutes = alarmDate.getMinutes();
  const { timeToDisplay: alarmTimeToDisplay, period: alarmPeriod } =
    timeFormat === '24'
      ? formatTo24hFormat(alarmHours, alarmMinutes)
      : formatTo12hFormat(alarmHours, alarmMinutes);

  useEffect(() => {
    turnBulbOff();
  }, []);

  const options = {
    taskName: 'Ligth Awake',
    taskTitle: 'Ligth Awake',
    taskDesc: 'Alarm set in background mode',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'scheme://host',
    parameters: {
      delay: 1000,
    },
  };

  const sleep = (time) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, time),
    );

  const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    const soundPlayer = new Sound(alarmSound, Sound.MAIN_BUNDLE, (error) => {
      soundPlayer.setCategory('Playback')
      if (error) console.log(error);
      soundPlayer.setNumberOfLoops(-1);
    });
    let timeOut;
    let isHandler = true;
    let alarmDuration = alarmDate.getTime() - new Date().getTime();

    const startPlaying = async (time) => {
      soundPlayer.play();
      soundPlayer.setVolume(0);
      if (isHandler && !timeOut) {
        console.log('start playing...');
        timeOut = setTimeout(() => {
          // soundPlayer.play();
          // soundPlayer.setVolume(1);
          isHandler = false;
          reminderAlert();
        }, time);
      }
    };

    const stopPlaying = () => {
      if (soundPlayer.isPlaying) {
        console.log('stop playing...');
        soundPlayer.stop(() => {
          soundPlayer.release(() => {
            isHandler = true;
            clearTimeout(timeOut);
          });
        });
      }
    };

    await new Promise(async (resolve) => {
      while (true) {
        if (BackgroundService.isRunning()) startPlaying(alarmDuration);
        else stopPlaying();
        await sleep(delay);
      }
    });
  };

  useEffect(() => {
    restoreDeviceBrightnessWhenAppIsReady();
    if (appStateVisible == 'background') {
      onBackgroundServices();
      notify();
    } else {
      BackgroundService.stop();
    }
  }, [appStateVisible]);

  const onBackgroundServices = async () => {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
      await BackgroundService.start(veryIntensiveTask, options);
    } else {
      await BackgroundService.start(veryIntensiveTask, options);
    }
  };

  const handleBackAction = () => {
    setDisplayTurnOffMessage(true);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackAction,
    );

    return () => backHandler.remove();
  }, []);

  // useEffect(() => {
  //   const setMinimumBrightness = async (value) => {
  //     // setting brightness after moving app to background on android
  //     // doesn't work if we didn't get brightness earlier
  //     await Brightness.getSystemBrightnessAsync();
  //     await Brightness.setSystemBrightnessAsync(value);
  //   };

  //   if (readyToChangeBrightness && isFocused) {
  //     setMinimumBrightness(0);
  //     return () => {
  //       setMinimumBrightness(0.7);
  //     };
  //   }
  // }, [readyToChangeBrightness, isFocused]);

  useEffect(() => {
    if (!isScrensaverActive) {
      const screensaverDelay = setTimeout(() => {
        setIsScreensaverActive(true);
      }, 60000);
      return () => clearTimeout(screensaverDelay);
    }
  }, [isScrensaverActive]);

  useEffect(() => {
    if (alarmDate.getTime() <= nowDateInMiliseconds) {
      setTimeout(() => {
        navigation.replace('FreeAlarm');
      }, 1000);
    }
  }, [nowDateInMiliseconds || alarmDate]);

  const disableScreensaver = () => {
    setIsScreensaverActive(false);
  };

  const handleCancelAlarmPress = () => {
    setDisplayTurnOffMessage(true);
  };

  const handleTurnOffPress = async () => {
    deactivateKeepAwake();
    await BackgroundService.stop();
    navigation.goBack();
  };

  const handleBackButtonPress = () => {
    setDisplayTurnOffMessage(false);
  };

  if (isScrensaverActive) {
    return (
      <TouchableWithoutFeedback onPress={disableScreensaver}>
        <Screensaver />
      </TouchableWithoutFeedback>
    );
  }

  return (
    <IllustratedBackgroundImage
      source={require('../../../../assets/images/home-background.png')}
      resizeMode="cover">
      <Background displayTurnOffMessage={displayTurnOffMessage} />
      <Container>
        <ClockContainer>
          <ClockBar>
            <Clock periodExist={Boolean(period)}>{timeToDisplay}</Clock>
            {period ? (
              <PeriodContainer>
                <PeriodText active={period === 'AM'}>AM</PeriodText>
                <PeriodText active={period === 'PM'}>PM</PeriodText>
              </PeriodContainer>
            ) : null}
          </ClockBar>
          <AlarmTimeBanner periodExist={Boolean(alarmPeriod)}>
            Alarm time: {alarmTimeToDisplay} {alarmPeriod}
          </AlarmTimeBanner>
        </ClockContainer>
      </Container>
      <TurnOffContainer>
        {displayTurnOffMessage ? (
          <>
            <TurnOffMessage>
              Do you really want to turn off the alarm?
            </TurnOffMessage>
            <TurnOffButton onPress={handleTurnOffPress}>
              <TurnOffText>Turn off</TurnOffText>
            </TurnOffButton>
            <BackButton onPress={handleBackButtonPress}>
              <BackButtonText>Back</BackButtonText>
            </BackButton>
          </>
        ) : (
          <CancelContainer
            onPress={handleCancelAlarmPress}
            displayTurnOffMessage={displayTurnOffMessage}>
            <CancelButton>
              <XIcon source={require('../../../../assets/images/cancel.png')} />
            </CancelButton>
            <CancelText>Cancel</CancelText>
          </CancelContainer>
        )}
      </TurnOffContainer>
    </IllustratedBackgroundImage>
  );
};

const Screensaver = styled.View`
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Background = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.darkBlueGray};
  opacity: 0.8;
  z-index: ${(props) => (props.displayTurnOffMessage ? 1 : 0)};
`;

const Container = styled.SafeAreaView`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClockContainer = styled.View`
  width: 100%;
  padding-bottom: 10%;
  display: flex;
`;

const Clock = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.black};
  font-size: ${(props) => (props.periodExist ? 90 : 100)}px;
`;

const PeriodContainer = styled.View`
  display: flex;
  margin-left: 16px;
`;

const PeriodText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.black};
  font-size: 24px;
  opacity: ${(props) => (props.active ? 1 : 0.3)};
`;

const AlarmTimeBanner = styled.Text`
  width: ${Math.max(scaleWidth(300), 300)}px;
  padding: 4px;
  margin: auto;
  border-radius: 12px;
  overflow: hidden;
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${(props) => (props.periodExist ? 26 : 30)}px;
  text-align: center;
  color: white;
  background-color: ${(props) => props.theme.colors.eggplant};
  opacity: 0.9;
`;

const CancelContainer = styled.TouchableOpacity`
  display: flex;
  align-items: center;
`;

const CancelButton = styled.View`
  height: 64px;
  width: 64px;
  border-radius: 32px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
  background-color: ${(props) => props.theme.colors.white};
`;

const CancelText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 24px;
  margin-bottom: 32px;
`;

const XIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const TurnOffContainer = styled.View`
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 3;
`;

const TurnOffMessage = styled.Text`
  width: 265px;
  margin: auto;
  margin-bottom: 64px;
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 26px;
  text-align: center;
  color: ${(props) => props.theme.colors.white};
`;

const TurnOffButton = styled.TouchableOpacity`
  width: 265px;
  height: 80px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 52px;
  background-color: ${(props) => props.theme.colors.white};
`;

const TurnOffText = styled.Text`
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 30px;
  color: ${(props) => props.theme.colors.eggplant};
`;

const BackButton = styled.TouchableOpacity`
  width: 265px;
  height: 80px;
  margin: auto;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackButtonText = styled.Text`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 30px;
  color: ${(props) => props.theme.colors.white};
`;

export default FreeSleep;
