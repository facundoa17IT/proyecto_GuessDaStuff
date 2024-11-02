/** React **/
import React, { useEffect, useState } from 'react';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout';
import CustomList from '../../components/layouts/CustomList';
import Modal from '../../components/layouts/Modal';
import { FaTools } from "react-icons/fa";

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';
import { ROLE, STATUS } from '../../utils/constants';

const UsersManagment = () => {
    /** Users List**/
    const [users, setUsers] = useState([]);
    const getPlayerName = (player) => player.username;
    const extraColumns = (item) => [item.role, item.status];
    const customFilter = [
        { label: 'Admin', criteria: item => item.role === ROLE.ADMIN },
        { label: 'User', criteria: item => item.role === ROLE.USER },
        { label: 'Blocked', criteria: item => item.role === STATUS.BLOCKED },
    ];

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch available categories when the component mounts
    useEffect(() => {
        axiosInstance.get('/api/users/v1')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleRegister = () => {
        try {
            const response = axiosInstance.post('/users/v1', {
                username,
                password,
                email
            }, {/** Empty Body **/}, { requiresAuth: true });
            console.log('Registration successful!');

           setIsModalOpen(!isModalOpen);
           location.reload();
        } catch (error) {
            console.error('Error registering:', error.response?.data?.message || error.message);
        }
    }

    return (
        <>
            <MainGameLayout
                canGoBack={false}
                hideLeftPanel={true}
                hideRightPanel={true}
                middleFlexGrow={2}
                middleHeader='Usuarios'
                middleContent={
                    <CustomList
                        listContent={users}
                        getItemLabel={getPlayerName}
                        extraColumns={extraColumns}
                        customFilter={customFilter}
                        buttons={['infoBtn', 'blockBtn', 'deleteBtn']}
                        addNewEntry={true}
                        onAddNewEntry={() => setIsModalOpen(!isModalOpen)}
                    />
                }
            />

            <Modal showModal={isModalOpen} onConfirm={handleRegister} closeModal={() => setIsModalOpen(!isModalOpen)} title="Registrar Admin">
                <FaTools fontSize={50} style={{ margin: '25px' }} />
                <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Modal>
        </>
    );
};

export default UsersManagment;
