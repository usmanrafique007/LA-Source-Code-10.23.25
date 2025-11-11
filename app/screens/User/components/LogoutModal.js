import { Modal } from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveScreenFontSize } from 'react-native-responsive-dimensions';

const CustomLogoutModal = ({ visible, onConfirm, onCancel, theme }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Backdrop>
        <ModalBody
          colors={[theme.colors.bluePurple, theme.colors.lightIndigo]}
          start={{ x: 0.7, y: 0 }}
        >
          <TitleText>Confirmation</TitleText>

          <SubText>Are you sure you want to log out?</SubText>

          <ButtonRow>
            <ActionButton bgColor="#FFD54F" onPress={onConfirm}>
              <ButtonLabel>Yes</ButtonLabel>
            </ActionButton>

            <ActionButton bgColor="#E0E0E0" onPress={onCancel}>
              <ButtonLabel>Cancel</ButtonLabel>
            </ActionButton>
          </ButtonRow>
        </ModalBody>
      </Backdrop>
    </Modal>
  );
};

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

const ModalBody = styled(LinearGradient)`
  width: 85%;
  height: 180px;
  border-radius: 20px;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  elevation: 7;
  shadow-opacity: 0.9;
  shadow-radius: 20px;
  shadow-offset: 0px 2px;
  shadow-color: #000;
`;

const CloseIcon = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const CloseText = styled.Text`
  font-size: 20px;
  color: #fff;
`;

const TitleText = styled.Text`
  font-size: ${responsiveScreenFontSize(2.8)}px;
  font-weight: bold;
  color: #f2453d;
`;

const SubText = styled.Text`
  font-size: ${responsiveScreenFontSize(2)}px;
  color: #fff;
  text-align: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${({ bgColor }) => bgColor || '#ccc'};
  flex: 1;
  margin: 0 5px;
  border-radius: 25px;
  padding-vertical: 10px;
  align-items: center;
`;

const ButtonLabel = styled.Text`
  color: #000;
  font-weight: bold;
`;


export default CustomLogoutModal;
