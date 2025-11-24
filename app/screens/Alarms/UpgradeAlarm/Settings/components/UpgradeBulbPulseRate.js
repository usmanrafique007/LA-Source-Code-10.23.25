import React, { useState, useEffect, useCallback } from 'react';

import Slider from '../../../../../components/Globals/Slider';
import Switch from '../../../../../components/Globals/Switch';

import styled from 'styled-components/native';
import {
  SettingContainer,
  SettingHead,
  SettingIcon,
  SettingTitle,
  Row,
} from '../../../../../styles/commonStyledComponents';
import { scaleWidth } from '../../../../../styles/scales';
import { pulseSettings } from '../../../../../constants/available-settings';

import updateAlarmDetails from '../../helper/updateAlarmDetails';
import { TouchableOpacity, View } from 'react-native';
import { useDevices } from '../../../../Bulbs/hooks/useDevices';
import { getHomeDetail } from '@owowagency/react-native-tuya';
import { useHomeId } from '../../../../../hooks/useHomeId';
import { getAsyncStorageData } from '../../../../../constants/utils';
import StorageProperty from '../../../../../constants/storage-property';
import { useFocusEffect } from '@react-navigation/native';

export default function UpgradeBulbPulseRate({
  alarm,
  hasUpdated,
  setHasUpdated,
  navigation
}) {
  const [bulbRate, setBulbRate] = useState(); // bulb pulse rate fetched from api
  const [bulbRateEnabled, setBulbRateEnabled] = useState(false); // bulb pulse rate enabled fetched from api
  const [bulbColor, setBulbColor] = useState('');


  useEffect(() => {
    setBulbRate(alarm?.bulb_pulse_rate);
    setBulbRateEnabled(alarm?.bulb_pulse_rate_enabled);
  }, [alarm]);

  const handleSwitchValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'bulb_pulse_rate_enabled', value).then(() => {
      setBulbRateEnabled(!bulbRateEnabled);
      setHasUpdated(!hasUpdated);
    });
  };

  const handleSliderValueChange = (value) => {
    updateAlarmDetails(alarm?.id, 'bulb_pulse_rate', value).then(() => {
      setHasUpdated(!hasUpdated);
    });
  };

  const handleBulbPress = () => {
    // setBulbModal(true);
    // return;
    navigation.navigate('Bulbs')

  };

  const getActiveDeviceColor = useCallback(async () => {
    try {
      const deviceColor = await getAsyncStorageData(StorageProperty.ACTIVE_DEVICE_COLOR);
      console.log('ACTIVE_DEVICE_COLOR', deviceColor);
      setBulbColor(deviceColor || 'ffffff');
    } catch (error) {
      console.error('Failed to get active device color:', error);
      setBulbColor('ffffff');
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      getActiveDeviceColor(); // your function to fetch and set bulbColor
    }, [])
  );

  return (
    <SettingContainer>
      <SettingHead>
        <TouchableOpacity onPress={handleBulbPress}>
          <Row>
            <SettingIcon
              source={require('../../../../../../assets/flashlight-icon.png')}
            />
            {bulbRateEnabled ? <SettingTitle>Bulb Setting</SettingTitle> : <SettingTitle>Use Bulb</SettingTitle>}
            <View style={[{
              width: 35,
              height: 35,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#ccc',
              margin: 10,
            }, { backgroundColor: bulbColor ? `#${bulbColor.replace('#', '').trim()}` : '#ffffff' },
            ]} />
          </Row>
        </TouchableOpacity>

        <Switch
          value={bulbRateEnabled}
          onValueChange={(v) => handleSwitchValueChange(v)}
        />
      </SettingHead>
      {bulbRateEnabled && (
        <SettingBody>
          <SettingSubTitleContainer>
            <SettingSubTitle>Bulb Flash Rate</SettingSubTitle>
          </SettingSubTitleContainer>
          <Slider
            step={bulbRate || pulseSettings[0].name}
            onStepChange={(v) => handleSliderValueChange(v)}
            labels={pulseSettings.map((setting) => setting.name)}
          />
        </SettingBody>
      )}
    </SettingContainer>
  );
}

const SettingBody = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SettingSubTitleContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 2px;
`;

const SettingSubTitle = styled(SettingTitle)`
  font-size: ${Math.min(scaleWidth(17), 17)}px;
`;
