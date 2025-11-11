import React, {useState, useEffect} from 'react';
import {Platform, View} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import styled from 'styled-components/native';
import AdPopupModal from './modals/AdPopupModal';
import AddBulbButton from './components/addBulbButton';
import BulbsList from './components/bulbsList';
import StorageProperty from '../../constants/storage-property';
import {getAsyncStorageData} from '../../constants/utils';
import {
  BackgroundImage,
  ScreenContent,
  ScreenContainer as DefaultScreenContainer,
  ScreenTitle,
  Spacer,
  StackContainer,
  StackChildWrapper,
  SetButton,
  ButtonText,
  SettingTitle,
} from '../../styles/commonStyledComponents';
import {useDevices} from './hooks/useDevices';
import useActivator from './hooks/useActivator';
import {useActiveBulbs} from '../../hooks/useActiveBulbs';
import NetInfo from '@react-native-community/netinfo';
import {Toast} from '../../components/Globals/Toast';
export function Body({navigation, route}) {
  const [adPopUpModalOpen, setAdPopUpModalOpen] = useState(false);
  const [isAdPopUpModalDisabled, setIsAdPopUpModalDisabled] = useState(true);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [toActivateDevice, setToActivateDevice] = useState(false);
  const {devices, loading, setLoading} = useDevices(
    isRefresh,
    setIsRefresh,
    route,
  );
  const [activeBulbs, {getActivatedDevices}] = useActiveBulbs();
  const [{activateDevice, deactivateDevice}] = useActivator();
  const [connectionInfo, setConnectionInfo] = useState(null);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("state", state);
      if (state.isConnected && state.details && state.details.ssid) {
        setConnectionInfo(state);
      } else if (state.isConnected === false) {
        setLoading(false);
        navigation.navigate('Home');
        return Toast(
          'Error',
          'Network not detected. Please check your network connection and try again.',
          'danger',
          'danger',
        );
      } else if (state.isConnected === false) {
        setLoading(false);
        navigation.navigate('Home');
        return Toast(
          'Error',
          'Server Not Detected. Please connect to a 2.5GHz Wifi Network and try again',
          'danger',
          'danger',
        );
      } else {
        setConnectionInfo(state);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [connectionInfo]);
  useEffect(() => {
    getActivatedDevices();
  }, [toActivateDevice]);
  useEffect(() => {
    async function checkUserAdPopUpModalPreference() {
      const disableAdModal = await getAsyncStorageData(
        StorageProperty.AD_MODAL_DISABLED,
      );
      setIsAdPopUpModalDisabled(disableAdModal === 'true');
    }
    checkUserAdPopUpModalPreference();
    setAdPopUpModalOpen(true);
    getActivatedDevices();
  }, []);
  const checkBulb = (device) => {
    if (!activeBulbs || activeBulbs.length === 0) {
      return false;
    }
    const found = activeBulbs.some((bulb) => {
      if (Platform.OS === 'ios') {
        return bulb.devId === device.devId;
      } else {
        return bulb.ownerId === device.ownerId;
      }
    });
    return found;
  };
  const handleStopPress = () => {
    setLoading(false);
    navigation.navigate('Home');
  };
  const handlePairingPress = () => {
    navigation.navigate('Pair');
  };
  const handleRefreshPress = () => {
    setIsRefresh(true);
  };
  const handleCheckboxPress = (device) => {
    if (checkBulb(device)) {
      deactivateDevice(device);
      setToActivateDevice(false);
    } else {
      activateDevice(device);
      setToActivateDevice(true);
    }
  };
  const handleCheckBox = (device) => {
    console.warn('check');
    
    handleCheckboxPress(device);
  };
  const handleSettingsIconPress = (device) => {
    navigation.navigate('Bulb', {device: device, status: 'configure'});
  };
  if (loading) {
    return (
      <ScreenContent style={{paddingTop: 0}}>
        <BackgroundImage style={{height: '100%'}}>
          <View style={{marginTop: 'auto', marginBottom: 'auto'}}>
            <AnimatedLoader
              visible={true}
              source={require('../../../assets/fetch.json')}
              animationStyle={{
                width: responsiveWidth(20),
                height: responsiveHeight(40),
              }}>
              <SettingTitle style={{fontSize: responsiveFontSize(3)}}>
                Fetching devices...
              </SettingTitle>
              <SetButton
                style={{
                  marginBottom:
                    Platform.OS === 'ios'
                      ? responsiveHeight(13)
                      : responsiveHeight(16),
                  marginTop: responsiveHeight(10),
                }}
                onPress={handleStopPress}>
                <ButtonText style={{fontSize: responsiveScreenFontSize(1.8)}}>
                  STOP
                </ButtonText>
              </SetButton>
            </AnimatedLoader>
          </View>
        </BackgroundImage>
      </ScreenContent>
    );
  }
  return (
    <ScreenContent style={{paddingTop: 0}}>
      <BackgroundImage style={{height: '100%'}}>
        {!isAdPopUpModalDisabled && adPopUpModalOpen && (
          <AdPopupModal
            adPopUpModalOpen={adPopUpModalOpen}
            setAdPopUpModalOpen={setAdPopUpModalOpen}
            isAdPopUpModalDisabled={isAdPopUpModalDisabled}
            setIsAdPopUpModalDisabled={setIsAdPopUpModalDisabled}
            isCheckboxSelected={isCheckboxSelected}
            setIsCheckboxSelected={setIsCheckboxSelected}
          />
        )}
        <Stack>
          <BulbsList
            devices={devices}
            check={checkBulb}
            handleCheckboxPress={handleCheckBox}
            handleSettingsIconPress={handleSettingsIconPress}
          />
          <Spacer />
          <AddBulbButton handlePairingPress={handlePairingPress} />
          <RefreshButton
            style={{fontSize: responsiveScreenFontSize(2)}}
            onPress={handleRefreshPress}>
            Refresh
          </RefreshButton>
        </Stack>
      </BackgroundImage>
    </ScreenContent>
  );
}
const Stack = ({children}) => {
  return (
    <StackContainer>
      {React.Children.map(children, (child, index) => {
        const isLastChild = index === children.length - 1;
        return isLastChild ? (
          child
        ) : (
          <StackChildWrapper>{child}</StackChildWrapper>
        );
      })}
    </StackContainer>
  );
};
const RefreshButton = styled(ScreenTitle)`
  font-size: ${responsiveFontSize(2)};
  color: ${(props) => props.theme.colors.yellow};
`;