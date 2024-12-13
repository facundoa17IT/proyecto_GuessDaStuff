import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketContext } from '../WebSocketProvider';
import { useNavigation } from '@react-navigation/native';
import { invitationData, setInviteResponse,setResponseIdGame} from '../Helpers';
import MainMenu from '../components/MainMenu';

const InvitationScreen = () => {

  const navigation = useNavigation();
  const [invitations, setInvitations] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false); // Controla si se muestra la sala de espera
  const [waitingData, setWaitingData] = useState(null); // Almacena la información del juego para la sala de espera
  const [userObj, setUserObj] = useState({}); // Estado para userObj
  const { invitationCollection, setInvitationCollection, client, invitation,setInvitation, suscribeToGameSocket,implementationGameBody,gameId } = useContext(SocketContext);
  const [continuar, setContinuar] = useState(true);


useEffect(() => {
  
  const loadUser = async () => {
    try {
      // Obtener el dato almacenado en AsyncStorage
      const jsonValue = await AsyncStorage.getItem('userObj');
      if (jsonValue != null) {
        const storedUser = JSON.parse(jsonValue); // Parsear el JSON a un objeto
        setUserObj(storedUser); // Establecer el estado con el objeto
      } else {
        console.log('No se encontró un usuario en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario de AsyncStorage:', error);
    }
  };

  loadUser();
}, []);

  useEffect(() => {
    if (invitationCollection.length > 0) {
     
      setInvitations((prevInvitations) => [
        ...prevInvitations,
        ...invitationCollection
          .filter((invitation) => invitation.userIdGuest !== invitation.userIdHost) // Filtrar autoinvitaciones
          .map((invitation) => ({
            id: invitation.id || Date.now().toString(), // Genera un id único si no existe
            usernameHost: invitation.usernameHost,
            message: invitation.message,
            userIdHost: invitation.userIdHost,
            userIdGuest: invitation.userIdGuest,
            gameId: invitation.gameId || 'pendingGameId',
            status: 'Pendiente',
          })),
      ]);

      //setInvitationCollection([]); // Limpiar la colección de invitaciones después de procesarlas
    }
  }, [invitationCollection]);


  const handleAccept = (invitationId) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);

    if (invitation) {
      respondToInvitation(true, invitation);
      setInvitations((prevInvitations) =>
        prevInvitations.filter((inv) => inv.id !== invitationId)
      );
      const HostObj = { username: invitation.usernameHost, userId: invitation.userIdHost };
      
      AsyncStorage.setItem('Host', JSON.stringify(HostObj)); // Convertir a JSON antes de guardar
      
      const InvitadoObj = { username: userObj.username, userId: userObj.userId};
      
      AsyncStorage.setItem('Guest', JSON.stringify(InvitadoObj)); // Convertir a JSON antes de guardar
    
      // Activar la sala de espera
      setWaitingData({
        gameId: invitation.gameId,
        hostUsername: invitation.usernameHost,
      });
      setIsWaiting(true);
      setInvitation(null);
    }
  };

  const handleReject = (invitationId) => {
    setInvitationCollection([]);
    const invitation = invitations.find((inv) => inv.id === invitationId);

    if (invitation) {
      respondToInvitation(false, invitation);
      setInvitations((prevInvitations) =>
        prevInvitations.filter((inv) => inv.id !== invitationId)
      );
      Alert.alert('Invitación rechazada', 'La invitación fue rechazada.');
      setInvitation(null);
    }
  };
  
    // 2)
    // Se gestiona que accion realizar dependiendo de la respuesta de la invitacion del socket
    useEffect(() => {
      if (invitation) {
          handleInvitationInteraction(invitation);
      }
  }, [invitation]);

  const removeInvitation = (userIdHost) => {
      // Filtra el array para excluir el elemento en el índice dado
      const updatedList = invitationCollection.filter(item => item.userIdHost !== userIdHost);
      setInvitationCollection(updatedList);
  };

  // 2.1)
  const handleInvitationInteraction = (invitation) => {
      if (invitation) {
          if (invitation.action === 'RESPONSE_IDGAME') {
              suscribeToGameSocket(invitation.gameId);
              
          } else {
              //console.warn("Invitation Action type not recognized:", invitation.action);
          }
      } else {
          console.error("Invalid Invitation");
      }
  };

  function respondToInvitation(response, invitation) {
      setInviteResponse(response, invitation.usernameGuest, invitation.userIdGuest, response ? "Ha aceptado la invitacion" : "Ha rechazado la invitacion");
      client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationData));
      //setInvitationCount(invitationCount - 1);
      removeInvitation(invitation.userIdHost);
      setInvitation(null);
  }


  useEffect(() => {
    if (isWaiting && waitingData) {
      setIsWaiting(false);
      if (implementationGameBody) {
        if (implementationGameBody.status === "INVITE_RULETA") {
          setTimeout(() => {
            // Resetear la navegación y limpiar los datos
            navigation.reset({
              index: 0, // Esto asegura que la pila de navegación se resetee
              routes: [
                {
                  name: "SlotMachineMulti", // La pantalla a la que deseas navegar
                  params: {
                    ruletaGame: implementationGameBody.ruletaGame,
                    finalSlot1: implementationGameBody.finalSlot1,
                    finalSlot2: implementationGameBody.finalSlot2,
                    finalSlot3: implementationGameBody.finalSlot3,
                    idGame: gameId,
                  },
                },
              ],
            });
            setInvitations([]); // Limpiar las invitaciones
            setInvitationCollection([]); // Limpiar la colección de invitaciones
            setWaitingData(null); // Limpiar los datos de la sala de espera
            setUserObj({}); // Limpiar el objeto del usuario
            setInvitation(null); // Limpiar la invitación actual
          }, 1000); // Retardo opcional para dar tiempo a la animación de espera
        }
      }
    }
  }, [implementationGameBody]);
  

  // Renderiza cada invitación
  const renderInvitation = ({ item }) => (
    <View style={styles.invitationCard}>
      <Text style={styles.host}>{item.usernameHost}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.status}>Estado: {item.status}</Text>
      <View style={styles.buttonsContainer}> 
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'green' }]}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderiza la sala de espera
  if (waitingData) {
    return (
      <View style={styles.waitingContainer}>
        <Text style={styles.title}>Sala de Espera</Text>
        <Text style={styles.waitingText}>
          Esperando que {waitingData.hostUsername || 'el anfitrión'} inicie la partida...
        </Text>
        <ActivityIndicator size="large" color="#B36F6F" style={styles.loader} />
      </View>
    );
  }


  // Render principal
  return (
    <MainMenu>
    <View style={styles.container}>
      <Text style={styles.title}>Invitaciones Recibidas</Text>
      {invitations.length === 0 ? (
        <Text style={styles.noInvitationsText}>No hay invitaciones por el momento.</Text>
      ) : (
        <FlatList
          data={invitations}
          keyExtractor={(item) => item.id.toString()} // Usamos el id como clave única
          renderItem={renderInvitation}
        />
      )}
    </View>
  </MainMenu>
  );
};

const styles = StyleSheet.create({
  waitingContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F5DC', // Color de fondo principal
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B36F6F', // Color para el título
    marginTop:20,
    marginBottom: 20,
  },
  waitingText: {
    fontSize: 18,
    color: '#B36F6F', // Color del texto informativo
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
    transform: [{ scale: 1.5 }], // Aumentar el tamaño del loader
  },
  noInvitationsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  invitationCard: {
    backgroundColor: "#B36F6F",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  host: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
  },
  status: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  noInvitationsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default InvitationScreen;
