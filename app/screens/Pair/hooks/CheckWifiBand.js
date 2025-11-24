import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

const checkWifiBand = async () => {
  const state = await NetInfo.fetch();

  if (state.type === NetInfoStateType.wifi && state.details) {
    const { frequency } = state.details;

    if (frequency >= 2400 && frequency <= 2500) {
      return '2.4 GHz';
    } else if (frequency >= 5100 && frequency <= 5900) {
      return '5 GHz';
    } else if (frequency >= 6000) {
      return '6 GHz';
    } else {
      return 'Unknown band';
    }
  }

  return 'Not connected to Wi-Fi';
};

export default checkWifiBand;
