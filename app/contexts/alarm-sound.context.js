import React, { useContext, useEffect, useRef, useState } from 'react';
import { soundSettings } from '../constants/available-settings';
import StorageProperty from '../constants/storage-property';
import { getAsyncStorageData, storeAsyncStorageData } from '../constants/utils';
export const AlarmSoundContext = React.createContext();
const defaultContext = {
  alarmSound: soundSettings[0]?.track,
  alarmSoundEnabled: false,
};
export function AlarmSoundContextProvider({ children }) {
  const [alarmSound, setAlarmSound] = useState(defaultContext.alarmSound);
  const [alarmSoundEnabled, setAlarmSoundEnabled] = useState(
    defaultContext.alarmSoundEnabled,
  );
  const [isDisableAlarm, setIsDisableAlarm] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState('open');
  const loadedStoreProperties = useRef(false);

  useEffect(() => {
    async function loadStateFromStorage() {
      const storageValues = await Promise.all([
        getAsyncStorageData(StorageProperty.ALARM_SOUND),
        getAsyncStorageData(StorageProperty.ALARM_SOUND_ENABLED),
        getAsyncStorageData(StorageProperty.IS_DISABLE_ALARM),
        getAsyncStorageData(StorageProperty.PRIVACY_MODAL)
      ]);
      setAlarmSound(storageValues[0] || defaultContext.alarmSound);
      setAlarmSoundEnabled(
        storageValues[1] === 'true' ?? defaultContext.alarmSoundEnabled,
      );
      setIsDisableAlarm(storageValues[2] || false)
      setIsPrivacyModalOpen(storageValues[3] || 'open')
      loadedStoreProperties.current = true;
    }
    loadStateFromStorage();
  }, []);

  const store = (key, value) => {
    if (loadedStoreProperties.current) {
      storeAsyncStorageData(key, value);
    }
  };

  useEffect(() => {
    store(StorageProperty.ALARM_SOUND, alarmSound);
  }, [alarmSound]);

  useEffect(() => {
    store(StorageProperty.ALARM_SOUND_ENABLED, `${alarmSoundEnabled}`);
  }, [alarmSoundEnabled]);

  useEffect(() => {
    store(StorageProperty.IS_DISABLE_ALARM, `${isDisableAlarm}`);
  }, [isDisableAlarm]);

  useEffect(() => {
    store(StorageProperty.PRIVACY_MODAL, `${isPrivacyModalOpen}`);
  }, [isPrivacyModalOpen]);

  return (
    <AlarmSoundContext.Provider
      value={{
        isDisableAlarm,
        setIsDisableAlarm,
        isPrivacyModalOpen,
        setIsPrivacyModalOpen,
        alarmSound,
        setAlarmSound,
        alarmSoundEnabled,
        setAlarmSoundEnabled,
      }}>
      {children}
    </AlarmSoundContext.Provider>
  );
}
export function useAlarmSoundContext() {
  const context = useContext(AlarmSoundContext);
  if (context === undefined) {
    throw new Error(
      'useAlarmSoundContext can only be used inside AlarmSoundContextProvider',
    );
  }
  return context;
}