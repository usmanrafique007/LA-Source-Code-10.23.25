import React from 'react';
import { Modal, PermissionsAndroid, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import styled from 'styled-components/native';
import { scaleHeight, scaleWidth } from '../../styles/scales';
import { theme } from '../../styles/theme';

const AlarmPermissionModal = ({
    greetings,
    message,
    showPopUp,
    setShowPopUp,
    handlePopupState
}) => {

    const checkPermissions = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
                if (granted === 'granted') {
                    handlePopupState(true);
                }
            } catch (error) {
            }
        }
        else{
            handlePopupState(true);
        }
    };

    const handleAllow = () => {
        setShowPopUp(false);
        checkPermissions()
    };

    const handleDeny = () => {
        setShowPopUp(false);
        handlePopupState(false);
    };

    return (
        <>
            {showPopUp && (
                <Modal visible={showPopUp} transparent={true} animationType="fade">
                    <Backdrop>
                        <ModalBody
                            colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
                            start={{ x: 0.7, y: 0 }}>
                            <CancelContainer onPress={() => handleDeny()}>
                                <ExitModalButton>
                                    <ModalXIcon
                                        source={require('../../../assets/images/cancel.png')}
                                    />
                                </ExitModalButton>
                            </CancelContainer>
                            <BulbColorPickerContainer>
                                <LottieView
                                    source={require('../../../assets/bulbWarning.json')}
                                    style={{
                                        width: responsiveScreenWidth(18),
                                        height: responsiveScreenHeight(18),
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        marginBottom: responsiveScreenHeight(0),
                                    }}
                                    autoPlay
                                    loop
                                />
                                <IconHolder>
                                    {greetings && <ScreenTitle
                                        style={{
                                            textAlign: 'center',
                                            fontSize: responsiveScreenFontSize(4),
                                            fontFamily: theme.fonts.bold,
                                        }}>
                                        {greetings}
                                    </ScreenTitle>}
                                </IconHolder>
                                <ScreenTitle style={{ textAlign: 'center' }}>
                                    {message}
                                </ScreenTitle>
                                <ButtonContainer>
                                    <SetChangeButton onPress={handleAllow}>
                                        <ButtonText>Allow</ButtonText>
                                    </SetChangeButton>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <SetChangeButton onPress={handleDeny}>
                                        <ButtonText>Deny</ButtonText>
                                    </SetChangeButton>
                                </ButtonContainer>
                            </BulbColorPickerContainer>
                        </ModalBody>
                    </Backdrop>
                </Modal>
            )}
        </>
    );
};
export default AlarmPermissionModal;
const ButtonContainer = styled.View`
  width: 100%;
  border-radius: 5px;
  padding-top: ${responsiveScreenHeight(2)};
`;
const BulbColorPickerContainer = styled.View`
  width: 100%;
  padding: 4.5% 4.9%;
  height: ${responsiveScreenHeight(65)};
  align-items: center;
`;
const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.darkIndigoTwo};
  font-size: ${scaleWidth(18)}px;
  font-family: ${(props) => props.theme.fonts.bold};
  margin: auto;
`;
const Backdrop = styled.View`
  width: 100%;
  height: 100%;
  background-color: #00000080;
`;
const CancelContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;
const ExitModalButton = styled.View`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
  elevation: 10;
  background-color: ${(props) => props.theme.colors.white};
`;
const IconHolder = styled.View`
  border-radius: ${responsiveScreenWidth(10)};
  padding-bottom: ${responsiveScreenHeight(0)}
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalBody = styled(LinearGradient)`
  elevation: 7;
  shadow-opacity: 0.9;
  shadow-radius: 20px;
  shadow-offset: 0px 2px;
  shadow-color: #000;
  display: flex;
  align-items: center;
  margin: auto;
  padding: 20px;
  border-radius: 20px;
  z-index: 100;
  max-width: 90%;
  height: ${responsiveScreenHeight(60)};
  width: 85%;
`;
const ModalXIcon = styled.Image`
  width: 12px;
  height: 12px;
  align-items: flex-end;
`;
const ScreenTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.default};
  color: ${(props) => props.theme.colors.white};
  font-size: ${responsiveScreenFontSize(2)};
`;
const SetChangeButton = styled.TouchableOpacity`
  width: ${scaleWidth(183)}px;
  height: ${scaleHeight(48)}px;
  background-color: ${(props) => props.theme.colors.yellow};
  border-radius: ${scaleWidth(24)}px;
  margin: auto;
`;
