import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { requestTrackingPermission, getTrackingStatus } from 'react-native-tracking-transparency';

const useAppTrackingTransparency = () => {
  useEffect(() => {
    const requestATT = async () => {
      if (Platform.OS === 'ios') {
        const status = await getTrackingStatus();

        if (status === 'not-determined') {
          const newStatus = await requestTrackingPermission();

          if (newStatus === 'authorized') {
            console.log('✅ User granted tracking permission');
            // Initialize tracking or advertising SDKs here
          } else {
            console.log('⚠️ Tracking permission denied or restricted');
            // Disable tracking-related features if needed
          }
        } else {
          console.log(`ℹ️ Tracking status is already: ${status}`);
        }
      }
    };

    requestATT();
  }, []);
};

export default useAppTrackingTransparency;
