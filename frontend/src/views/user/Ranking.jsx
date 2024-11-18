/** React **/
import React, { useEffect, useState, useContext } from 'react';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout'
import CustomList from '../../components/layouts/CustomList';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';

const Ranking = () => {

    const [partidasWin, setPartidasWin] = useState([]);

    const username = (game) => game.username;

    const customFilter = [
        { label: 'Partidas ganadas', criteria: item => item.tipo === "PW" },
        { label: 'Mayor Puntaje - Individual', criteria: item => item.tipo === "MPI" },
        { label: 'Mayor Puntaje - Multiplayer', criteria: item => item.tipo === "MPM"},
        { label: 'Menor Tiempo - Individual', criteria: item => item.tipo === "MTS" },
        { label: 'Menor Tiempo - Multiplayer', criteria: item => item.tipo === "MTM" }
    ];

    const fetchAllRanking = async () => {
        try {
            const response = await axiosInstance.get(`/users/v1/rankingPartidasWin`, { requiresAuth: true });
            const response2 = await axiosInstance.get(`/users/v1/rankingPuntaje`, { requiresAuth: true });
            const response3 = await axiosInstance.get(`/users/v1/rankingTiempo`, { requiresAuth: true });
            
            const partidasWin = response.data.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                criterio: "Partidas ganadas: " + partida.criterio,
                tipo: "PW" // Reemplazar el id_game
            }));

            const puntajeSingle = response2.data.INDIVIDUAL.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                criterio: "Puntaje generado: " + partida.criterio,
                tipo: "MPI" // Reemplazar el id_game
            }));

            const puntajeMulti = response2.data.MULTIPLAYER.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                criterio: "Puntaje generado: " + partida.criterio,
                tipo: "MPM" // Reemplazar el id_game
            }));

            const tiempoSingle = response3.data.INDIVIDUAL.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                criterio: "Tiempo empleado: " + partida.criterio,
                tipo: "MTS" // Reemplazar el id_game
            }));

            const tiempoMulti = response3.data.MULTIPLAYER.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                criterio: "Tiempo empleado: " + partida.criterio,
                tipo: "MTM" // Reemplazar el id_game
            }));

            const combinedRanking = [...partidasWin, ...puntajeSingle, ...puntajeMulti, ...tiempoSingle, ...tiempoMulti];
            
            setPartidasWin(combinedRanking);
        }
         catch (error) {
            console.error('Error fetching all rankings:', error);
        }
    }

    const extraColumns = (item) => {
        return [
            item.criterio, // Usa 'criterio' como el número de partidas ganadas
        ];
    };
    

    useEffect(() => {
        fetchAllRanking();
    }, []);


    return (
        <MainGameLayout
            hideLeftPanel={true}
            hideRightPanel={true}
            middleHeader='Ranking'
            middleContent={
                <CustomList
                    listId={"partidasWin"}
                    listContent={partidasWin}
                    getItemLabel={username}
                    extraColumns={extraColumns}
                    customFilter={customFilter}
                    // buttons={['infoBtn']}
                    // onButtonInteraction={}
                />
            }
        />
    );
};

export default Ranking;