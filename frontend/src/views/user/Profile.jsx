/** React **/
import React from 'react';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout'
import CustomList from '../../components/layouts/CustomList';

/** Icons **/
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
    const userObj = JSON.parse(localStorage.getItem("userObj"));

    return (
        <MainGameLayout
        leftHeader='Perfil'
        leftContent={
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                    <FaUserCircle style={{ fontSize: '100px' }} />
                </div>

                <h1 style={{ marginBottom: '0px' }}>{userObj.username}</h1>
                <p>{userObj.email}</p>
                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <button style={{ fontSize: 'small', width: '200px' }}><span><FaEdit style={{ marginRight: '5px' }} />Editar Perfil</span></button>
                    <button style={{ fontSize: 'small', width: '200px' }}><ImExit style={{ marginRight: '5px' }} />Cerrar Sesion</button>
                    <button style={{ fontSize: 'small', width: '200px', backgroundColor: '#DC143C' }}><RiDeleteBin2Fill style={{ marginRight: '5px' }} />Eliminar Cuenta</button>
                </div>
            </div>
        }
        middleFlexGrow={2}
        middleHeader='Historial'
        middleContent={
            <CustomList
                // listContent={null}
                // getItemLabel={getGameModeId}
                // extraColumns={extraColumns}
                // buttons={['infoBtn']}
            />
        }
        hideRightPanel={true}
        />
    );
};

export default Profile;