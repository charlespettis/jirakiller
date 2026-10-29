import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GridBackground from './components/GridBackground';
export default function App() {
  return (
    <View style={styles.container}>
      <GridBackground>
        <Text>Open up App.js to start working on your app!</Text>
      </GridBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
