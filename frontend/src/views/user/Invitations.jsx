/** React **/
import React, { useContext } from 'react';

/** Components **/
import CustomList from '../../components/layouts/CustomList';
import MainGameLayout from '../../components/layouts/MainGamelayout'

/** Context API **/
import { SocketContext } from '../../contextAPI/SocketContext';

const Invitations = () => {
    /** Invitations List**/
    const { invitationCollection } = useContext(SocketContext);

    return (
        <div>
            <h2>Invitaciones</h2>
            {invitationCollection.length > 0 ? (
                <ul>
                    {invitationCollection.map((invitation) => (
                        <li key={invitation.gameId || invitation.userIdHost}> {/* Use unique key if available */}
                            <p><strong>Mensaje:</strong> {invitation.message}</p>
                            <p><strong>Host:</strong> {invitation.userIdHost}</p>
                            <p><strong>Invitado:</strong> {invitation.userIdGuest}</p>
                            <p><strong>Estado de aceptación:</strong> {invitation.accepted === null ? "Pendiente" : invitation.accepted ? "Aceptado" : "Rechazado"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay invitaciones en este momento.</p>
            )}
        </div>
    );
};

export default Invitations;