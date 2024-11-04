/** React **/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout';
import CustomList from '../../components/layouts/CustomList';
import Modal from '../../components/layouts/Modal';
import { FaTools } from "react-icons/fa";

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';
import { ROLE, STATUS } from '../../utils/constants';

const UsersManagment = () => {
    const navigate = useNavigate();

    /** Users List**/
    const [users, setUsers] = useState([]);
    const getPlayerName = (player) => player.username;
    const extraColumns = (item) => [item.role, item.status];
    const customFilter = [
        { label: 'Admin', criteria: item => item.role === ROLE.ADMIN },
        { label: 'User', criteria: item => item.role === ROLE.USER },
        { label: 'Blocked', criteria: item => item.role === STATUS.BLOCKED },
        { label: 'Deleted', criteria: item => item.role === STATUS.DELETED },
    ];

    /** Register Admin */
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users/v1', {
                requiresAuth: true,
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdminRegister = async () => {
        const body = { 
            username, 
            password, 
            email 
        };

        try {
            const response = await axiosInstance.post('/users/v1', body, { requiresAuth: true });
            setIsModalOpen(!isModalOpen);
            location.reload();
            console.log('Registration successful!', response);
        } catch (error) {
            console.error('Error registering:', error.response?.data?.message || error.message);
        }
    };   
    
    const handleUsersListInteraction = (listId, buttonKey, item) => {
        if (listId === "usersList") {
            console.log("Users List Interaction");
            switch (buttonKey) {
                case 'infoBtn':
                    console.log('User Info');
                    navigate("/admin/user-details")
                    break;

                case 'deleteBtn':
                    console.log('Delete User');
                    navigate("/admin/delete-user");
                    break;

                case 'blockBtn':
                    console.log('Block User');
                    if(item.status === "BLOCKED"){
                        alert("El usuario ya se encuentra bloqueado!");
                        return;
                    }
                    navigate("/admin/block-user");
                    break;

                case 'unblockBtn':
                    console.log('Unblock User');
                    if(item.status === "BLOCKED"){
                        navigate("/admin/unblock-user");
                        return;
                    }
                    alert("El usuario no ha sido bloqueado previamente!");
                    break;

                default:
                    console.warn("Action type not recognized:", buttonKey);
            }
        } else {
            console.log("Error list ID");
        }
    };

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
                        listId={"usersList"}
                        listContent={users}
                        getItemLabel={getPlayerName}
                        extraColumns={extraColumns}
                        customFilter={customFilter}
                        buttons={['infoBtn', 'blockBtn', 'unblockBtn', 'deleteBtn']}
                        addNewEntry={true}
                        onAddNewEntry={() => setIsModalOpen(!isModalOpen)}
                        onButtonInteraction={handleUsersListInteraction}
                    />
                }
            />

            <Modal showModal={isModalOpen} onConfirm={handleAdminRegister} closeModal={() => setIsModalOpen(!isModalOpen)} title="Registrar Admin">
                <FaTools fontSize={50} style={{ margin: '25px' }} />
                <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Modal>
        </>
    );
};

export default UsersManagment;
