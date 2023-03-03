import {SafeAreaView, StyleSheet} from 'react-native';
import AppNavigation from './app/navigation/navigation';
import {AuthProvider} from './app/components/AutContext/AutContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
   <AuthProvider>
      <SafeAreaProvider>
     <SafeAreaView style={styles.container}>
       <AppNavigation />  
     </SafeAreaView>
      </SafeAreaProvider>
   </AuthProvider>   
   ); 
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    flexDirection: 'row',
    flexWrap: 'wrap'    
  },
});

export default App;