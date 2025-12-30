import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import RootStack from './src/navigations/RootStack';
import { AuthProvider } from './src/context/AuthContext';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} />
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
