/** React **/
import React, {useEffect, useState} from 'react';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout';
import CustomList from '../../components/layouts/CustomList';

/** Utils **/
import axiosInstance from '../../AxiosConfig';
import { ROLE, STATUS } from '../../utils/constants';

const UsersManagment = () => {
    /** Users List**/
    const [users, setUsers] = useState([]);
    const getPlayerName = (player) => player.username;
    const extraColumns = (item) => [item.role];
    const customFilter = [
        {label: 'Admin', criteria: item => item.role === ROLE.ADMIN},
        {label: 'User', criteria: item => item.role === ROLE.USER},
        {label: 'Blocked', criteria: item => item.role === STATUS.BLOCKED},
    ];

    // Fetch available categories when the component mounts
    useEffect(() => {
        axiosInstance.get('/api/admin/listUsers')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
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
                />
            }
        />
    );
};

export default UsersManagment;
