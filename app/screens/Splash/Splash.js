import React, {useCallback, useEffect, useState} from 'react';
import {FullscreenNoFlickerImage} from '../../styles/commonStyledComponents';
import {Linking} from 'react-native';

const SPLASH_CHANGE_INTERVAL = 500;

const splashSources = [
  require('../../../assets/images/splash/asleep.jpg'),
  require('../../../assets/images/splash/awake.jpg'),
];

const Splash = ({navigation}) => {
  const [splashSourceIndex, setSplashSourceIndex] = useState(0);

  const performDelayedAction = (callback, delay) => {
    setTimeout(callback, delay);
  };

  const handleAlarmScreen = async () => {
    Linking.getInitialURL()
      .then((url) => {
        if (url && url === 'lightawake://alarm') {
          navigation.navigate('FreeAlarm');
        } else {
          navigation.replace('Home');
        }
      })
      .catch((error) => {
        navigation.replace('Home');
      });
  };

  const validateSplashTimeout = useCallback(() => {
    splashSourceIndex === splashSources.length - 1
      ? performDelayedAction(() => handleAlarmScreen(), SPLASH_CHANGE_INTERVAL)
      : performDelayedAction(() => {
          setSplashSourceIndex((prev) => prev + 1);
        }, SPLASH_CHANGE_INTERVAL);
  }, [splashSourceIndex, navigation]);

  useEffect(() => {
    validateSplashTimeout();
  }, [validateSplashTimeout]);

  return (
    <FullscreenNoFlickerImage
      source={splashSources[splashSourceIndex]}
      resizeMode="cover"
    />
  );
};

export default Splash;
