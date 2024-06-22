import {Dimensions} from 'react-native';

const wp = (percent: number) => {
  const {width} = Dimensions.get('window');
  return (percent * width) / 100;
};

const hp = (percent: number) => {
  const {height} = Dimensions.get('window');
  return (percent * height) / 100;
};

const utils = {hp, wp};

export default utils;
