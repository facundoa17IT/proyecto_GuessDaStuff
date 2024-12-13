import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { buttonStyles } from '../styles/buttons';
import MainMenu from '../components/MainMenu';

const Home = () => {
  const navigation = useNavigation();

  const handleNavigation = (gameMode) => {
    navigation.navigate('GameSet', { gameMode });
  };

  return (
    <MainMenu>
      <View style={styles.container}>
      <Logo/>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleNavigation('individual')}>
          <Text style={buttonStyles.buttonText}>Partida Individual</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleNavigation('multiplayer')}>
          <Text style={buttonStyles.buttonText}>Partida Multijugador</Text>
        </TouchableOpacity>
      </View>
    </MainMenu>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  button: {
    backgroundColor: "#B36F6F",
    padding: 15,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#653532",
    width: 230,
    alignItems: "center",
    marginTop: 50 },
});

export default Home;
