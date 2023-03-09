import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Slider from '../../components/Slider/Slider';

const HelpScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.box}>
        <View style={styles.inner}>
        <Slider />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: "100%",
    padding: "5%",
    // backgroundColor: "red",
  },
  inner: {
    flex: 1,
    // backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HelpScreen;
