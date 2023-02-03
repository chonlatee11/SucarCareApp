import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Slider from '../../components/Slider/Slider';

const HelpScreen = () => {
  return (
    <SafeAreaView>
      <Slider />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HelpScreen;
