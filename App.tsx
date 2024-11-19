import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FolderScreen from './src/screens/FolderScreen';
import FolderDetailScreen from './src/screens/FolderDetailScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Folders" 
            component={FolderScreen}
            options={{ title: 'My Folders' }}
          />
          <Stack.Screen 
            name="FolderDetail" 
            component={FolderDetailScreen}
            options={({ route }) => ({ title: route.params.folderName })}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
