/** React **/
import React, { useEffect, useState } from 'react';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout'
import CustomList from '../../components/layouts/CustomList';
import axiosInstance from '../../utils/AxiosConfig';

/** Icons **/
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
    const userObj = JSON.parse(localStorage.getItem("userObj"));
    const [profileImage, setProfileImage] = useState(null); // Estado para la imagen de perfil

    // Obtener la URL de la imagen de perfil desde el backend
    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axiosInstance.get(`/users/v1/getImageProfile/${userObj.username}`, { requiresAuth: true });
                console.log(response.data);
                const data = await response.data;
                if(data === 'urlDoMacaco'){
                    setProfileImage(null)
                }else{
                    setProfileImage(data);
                }
                
            } catch (error) {
                console.error("Error de red al obtener la imagen de perfil:", error);
            }
        };

        fetchProfileImage();
    }, [userObj.username]);

    return (
        <MainGameLayout
        leftHeader='Perfil'
        leftContent={
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                        {/* Mostrar imagen de perfil si existe, de lo contrario el ícono */}
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Foto de perfil"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <FaUserCircle style={{ fontSize: '100px' }} />
                        )}
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