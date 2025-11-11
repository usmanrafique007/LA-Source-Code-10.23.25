/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import {useIAP} from 'react-native-iap';
import {Toast} from '../../../components/Globals/Toast';
import {alarmIdentifier} from '../../../constants';
import AxiosRequestHandler, {
  connectionPath,
  method,
} from '../../../network/AxiosRequestHandler';

export const useAlarms = (hasAlarmPurchased) => {
  const [alarm, setAlarm] = useState([]);
  const [loader, setLoader] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const {connected, products, getProducts} = useIAP();

  useEffect(() => {
    fetchProducts();
  }, [hasAlarmPurchased]);
  console.log(products,'ss');

  useEffect(() => {
    if (products.length === 0) {
      return setAlarm([]);
    }
    
    get(products);
  }, [hasFetched]);

  async function fetchProducts() {
    try{
      setLoader(true);

      if (connected) {
      await getProducts({skus: alarmIdentifier});       
      }
      setLoader(false);
  
      setHasFetched(true);
    }
    catch(e){
      console.error(e);
      
      Toast('Error', e);
    }
 
  }

  async function get(products) {
    try {
      const data = {
        products: products,
      };
      const requestConfig = {
        data: data,
        method: method.post,
        url: `${connectionPath.alarms.importAlarms}`,
      };

      const response = await AxiosRequestHandler(requestConfig);
      console.log(response.data.alarm,'RESS');
      
      if (response) {
        setAlarm(response.data.alarm);
      }

      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    alarm,
    loader,
    setLoader,
  };
};
