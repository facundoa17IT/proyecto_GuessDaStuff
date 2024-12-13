import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../../assets/GDS-vertical-logo.png';
import { useNavigation } from '@react-navigation/native';
import { SocketContext } from '../WebSocketProvider';

const HeaderMain = () => {
  
  const navigation = useNavigation();
  const { invitation, setInvitation, invitationCount, setInvitationCount, invitationCollection, setInvitationCollection } = useContext(SocketContext);


  

  // // Actualiza el contador cuando llegan nuevas invitaciones
  useEffect(() => {
    if (invitationCollection.length > 0) {
      const newInvitations = invitationCollection.filter(
        (invitation) => invitation.userIdGuest !== invitation.userIdHost // Excluir autoinvitaciones
      );
    }
  }, [invitationCollection]);


  useEffect(() => {
    if (invitation) {
        handleInvitationInteraction(invitation);
        console.log(invitation);
    }
}, [invitation]);

  const handleInvitationInteraction = (invitation) => {
    if (invitation) {
        if (invitation.action === 'INVITE') {
            setInvitationCount(invitationCount + 1);
            setInvitationCollection([...invitationCollection, invitation]);
            setInvitation(null);
        }
    } else {
        console.error("Invalid Invitation");
    }
};

  return (
    <View style={styles.header}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.buttonsContainer}>
        {/* Botón de invitaciones */}
        <TouchableOpacity style={styles.invitationButton}  onPress={() => {
          navigation.navigate('InvitationScreen'); // Navega a la pantalla de invitaciones
        }}>
          <Icon name="mail-outline" size={40} color="#000000" />
          {invitationCollection.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{invitationCollection.length}</Text>
          </View>
        )}
        </TouchableOpacity>
     
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Config')}>
          <Icon name="settings-outline" size={40} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#B36F6F',
    height: 80,
    justifyContent: 'space-between', 
    alignItems: 'center',
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    width: '109%', 
    position: 'relative', 
    top: 0, 
    left: 0, 
  },
  logo: {
    width: 200, 
    height: '80%', 
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invitationButton: {
    width: 70,
    height: 70,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'transparent', 
    marginRight: 10, 
  },
  settingsButton: {
    width: 70, 
    height: 70, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 

  },
  badge: {
    position: 'absolute',
    top: 15,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#653532',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HeaderMain;
