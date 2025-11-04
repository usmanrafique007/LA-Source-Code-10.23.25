import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import BackButton from '../../components/Globals/BackButton';

import styled from 'styled-components/native';
import { scaleWidth, scaleHeight } from '../../styles/scales';
import {
  SettingContainer,
  SettingHead,
  ScreenContainer as DefaultScreenContainer,
  ScreenContent,
  ScreenHead,
  ScreenTitle,
  SettingTitle,
  CancelContainer,
  ExitModalButton,
  Backdrop,
  ModalBody,
  ModalXIcon,
  ButtonText,
} from '../../styles/commonStyledComponents';
import { theme } from '../../styles/theme';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../network/AxiosRequestHandler';

import { removeAsyncStorageData } from '../../constants/utils';
import StorageProperty from '../../constants/storage-property';
import { Toast } from '../../components/Globals/Toast';
import { useAlarmSoundContext } from '../../contexts/alarm-sound.context';
import { useTuyaServices } from '../../hooks/useTuyaServices';
import LottieView from 'lottie-react-native';
import CustomLogoutModal from './components/LogoutModal';

export default function UserProfileSettings({ navigation, route }) {
  const { setIsStorePermission } = useAlarmSoundContext();
  const { logoutTuya } = useTuyaServices()
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warningModal, setWarningModal] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const params = {};
        const requestConfig = {
          params: params,
          method: method.get,
          url: `${connectionPath.users.getUser}`,
        };

        var response = await AxiosRequestHandler(requestConfig);

        if (response) {
          var { user } = response.data;
          setUser(user);
          setLoading(false);
        }
      } catch (error) {
        return error;
      }
    }

    fetchUser();
  }, [route.params]);

  async function logout() {
    setWarningModal(false);
    try {
      const data = {};
      const requestConfig = {
        data: data,
        method: method.delete,
        url: `${connectionPath.auth.logout}`,
      };

      const response = await AxiosRequestHandler(requestConfig);

      if (response) {
        logoutGoogleUser();
        removeAsyncStorageData(StorageProperty.USER_TOKEN);
        Toast('Success', 'Logout successful!', 'success', 'success');
        logoutTuya()
        setTimeout(() => {
          navigation.navigate('Home');
          // setIsStorePermission(true)
        }, 2000);
      }
    } catch (error) {
      Toast('Danger', 'An error occurred. Try again.', 'danger', 'danger');
    }
  }

  const handleCloseModal = () => {
    setWarningModal(false);
  };

  async function logoutGoogleUser() {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn && Platform.OS === 'android') {
      await GoogleSignin.signOut();
    }
  }

  const renderDisplay = () => {
    function isLoading() {
      return (
        <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <AnimatedLoader
            visible={true}
            source={require('../../../assets/fetch.json')}
            animationStyle={{
              width: responsiveScreenWidth(20),
              height: responsiveScreenHeight(35),
            }}>
            <SettingTitle style={{ fontSize: responsiveScreenFontSize(3) }}>
              Loading...
            </SettingTitle>
          </AnimatedLoader>
        </View>
      );
    }

    function isIdle() {
      return (
        <>
          <SettingContainer style={{ backgroundColor: theme.colors.lightIndigo }}>
            <SettingHead>
              <UserContainer>
                <IconImage
                  source={require('../../../assets/user-profile.png')}
                />
                <ScreenTitleContainer>
                  <EmailContainer>{user.email}</EmailContainer>
                  <NameContainer>
                    <Text>
                      {(user.first_name ?? '') + ' ' + (user.last_name ?? '')}
                    </Text>
                  </NameContainer>
                </ScreenTitleContainer>
              </UserContainer>
              <UserContainer
                style={{
                  justifyContent: 'flex-end',
                  width: `5%`,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate('EditUserProfileSettings');
                  }}>
                  <EditingIcon
                    source={require('../../../assets/settings.png')}
                  />
                </TouchableWithoutFeedback>
              </UserContainer>
            </SettingHead>
          </SettingContainer>
          <ScreenContainer style={{ marginTop: responsiveScreenHeight(65) }}>
            <TouchableOpacity onPress={() => setWarningModal(true)}>
              <LogoutButton>Logout</LogoutButton>
            </TouchableOpacity>
          </ScreenContainer>
        </>
      );
    }

    var status = {
      true: isLoading,
      false: isIdle,
    };

    return status[loading]();
  };

  return (
    <>
      <ScreenContainer>
        <ProfileScreenHead>
          <BackButton onPress={() => navigation.navigate('Store')} />
          <ScreenTitle>My Profile</ScreenTitle>
        </ProfileScreenHead>
        <ScreenContent style={{ paddingTop: 0 }}>{renderDisplay()}</ScreenContent>
      </ScreenContainer>
      <CustomLogoutModal
        visible={warningModal}
        onConfirm={logout}
        onCancel={handleCloseModal}
        theme={theme}
      />
    </>
  );
}

// const Spacer = styled.View``;

const LogoutButton = styled.Text`
  font-size: ${responsiveScreenFontSize(2.5)};
  font-family: ${(props) => props.theme.fonts.bold};
  color: ${(props) => props.theme.colors.yellow};
  margin: auto;
`;

const NameContainer = styled(SettingTitle)`
  font-size: ${responsiveScreenFontSize(2.5)};
  font-family: ${theme.fonts.bold};
  width: ${responsiveScreenWidth(50)};
  // height: ${responsiveScreenHeight(7)};
`;

const EmailContainer = styled(SettingTitle)`
  font-size: ${responsiveScreenFontSize(1.5)};
  font-family: ${theme.fonts.regular};
  width: ${responsiveScreenWidth(50)};
`;

const IconImage = styled.Image`
  width: ${responsiveScreenWidth(20)};
  height: ${responsiveScreenHeight(9.2)};
  margin-right: ${responsiveScreenHeight(2)};
  object-fit:contain
`;

const UserContainer = styled.View`
  width: 85%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EditingIcon = styled.Image`
  width: ${responsiveScreenWidth(6)};
  height: ${responsiveScreenHeight(3)};
  object-fit:contain;
`;

const ScreenContainer = styled(DefaultScreenContainer)`
  padding: 0;
`;

const ScreenTitleContainer = styled.View`
  width: 100%;
  margin-right: 10%;
`;

const ProfileScreenHead = styled(ScreenHead)`
  padding-bottom: ${scaleHeight(35)}px;
`;

const BulbColorPickerContainer = styled.View`
  width: 100%;
  padding: 4.5% 4.9%;
  height: ${responsiveScreenHeight(65)};
  align-items: center;
`;

const IconHolder = styled.View`
  border-radius: ${responsiveScreenWidth(10)};
  padding-bottom: ${responsiveScreenHeight(2)}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.View`
  width: 100%;
  border-radius: 5px;
  padding-top: ${responsiveScreenHeight(2)};
`;


const SetChangeButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;
