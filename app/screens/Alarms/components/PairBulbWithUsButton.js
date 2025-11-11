import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  ScreenContainer as DefaultScreenContainer,
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../styles/commonStyledComponents';
import BulbModal from '../../../components/Modals/BulbModal';
import AxiosRequestHandler, { connectionPath, method } from '../../../network/AxiosRequestHandler';
import InformUserModal from '../../../components/Modals/InformUserModal';
import { useDevices } from '../../Bulbs/hooks/useDevices';

export function PairBulbWithUsButton({ navigation,route }) {
  const [bulbModal, setBulbModal] = useState(false);
  const [informUserModal, setInformUserModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const {devices, loading, setLoading} = useDevices(
    isRefresh,
    setIsRefresh,
    route
  );

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
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  }

useEffect(()=>{
  verifyUser()
},[])

  const handleBulbPress = () => {
    // setBulbModal(true);
    // return;
    isLoggedIn?
    navigation.navigate('Bulbs')
    :
    setInformUserModal(true)
  };

  return (
    <>
      <TouchableOpacity onPress={handleBulbPress}>
        <SettingContainer>
          <SettingHead>
            <Row>
              <SettingIcon
                source={require('../../../../assets/flashlight-icon.png')}
              />
              <SettingTitle>{devices?.length>0?'Select Bulb':' Pair Bulb With Us'}</SettingTitle>
            </Row>
          </SettingHead>
        </SettingContainer>
      </TouchableOpacity>
      {informUserModal && (
        <InformUserModal
          informUserModal={informUserModal}
          setInformUserModal={setInformUserModal}
          greetings={'Welcome'}
          message={'Sign up to access the Smart Buld Feature.'}
          isGuestUser={true}
          navigation={navigation}
        />
      )}
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
    </>
  );
}
