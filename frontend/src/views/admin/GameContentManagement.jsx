/** React **/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout';
import CustomList from '../../components/layouts/CustomList';

/** Utils **/
import axiosInstance from '../../AxiosConfig';
import { CATEGORY_STATUS } from '../../utils/constants';

const GameContentManagement = () => {
    const navigate = useNavigate();
    
    /** Categories List **/
    const categoryListId = "categoriesList";
    const [categories, setCategories] = useState([]);
    const getCategoryName = (category) => category.name;
    const extraColumns = (item) => [item.description, item.status];
    const customFilter = [
        { label: 'Initialized', criteria: item => item.status === CATEGORY_STATUS.INITIALIZED },
        { label: 'Empty', criteria: item => item.status === CATEGORY_STATUS.EMPTY },
        { label: 'Deleted', criteria: item => item.status === CATEGORY_STATUS.DELETED }
    ];
    
    /** Game Modes List **/
    const gameModesListId = "gameModesList";
    const gameModes = [
        { id: 1, name: "Ordena la Palabra" },
        //{ id: 2, name: "Ordena la fecha" },
        { id: 3, name: "Adivina la Frase" }
    ]

    // Fetch all categories
    useEffect(() => {
        axiosInstance.get('/auth/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleAddNewCategory = () => {
        navigate("/admin/add-category")
    }

    const handleCategoryListInteraction = (listId, buttonKey, item) => {
        if (listId === categoryListId) {
            console.log("Category List Interaction");
            switch (buttonKey) {
                case 'infoBtn':
                    console.log('Show info for category');
                    navigate("/admin/category-details")
                    break;

                case 'deleteBtn':
                    console.log('Delete category');
                    navigate("/admin/delete-category");
                    break;

                case 'editBtn':
                    console.log('Edit category');
                    navigate("/admin/edit-category");
                    break;

                default:
                    console.warn("Action type not recognized:", buttonKey);
            }
        } else {
            console.log("Error list ID");
        }
    };

    const handleGameModeListInteraction = (listId, buttonKey, item) => {
        if (listId === gameModesListId) {
            console.log("Game Mode List Interaction");
            if (buttonKey === 'addBtn') {
                console.log('Add game mode');
                navigate('/admin/add-title', {
                    state: {
                        title: 'Add Title',
                    }
                });
            } else {
                console.warn("Action type not recognized:", buttonKey);
            }
        } else {
            console.log("Error list ID");
        }
    };

    return (
        <MainGameLayout
            canGoBack={false}
            hideLeftPanel={true}
            middleFlexGrow={2}
            middleHeader='Categorias'
            middleContent={
                <CustomList
                    listId={categoryListId}
                    listContent={categories}
                    getItemLabel={getCategoryName}
                    extraColumns={extraColumns}
                    customFilter={customFilter}
                    addNewEntry={true}
                    onAddNewEntry={handleAddNewCategory}
                    buttons={["infoBtn", "editBtn", "deleteBtn"]}
                    onButtonInteraction={handleCategoryListInteraction}
                />
            }
            rightHeader='Modos de Juego'
            rightContent={
                <CustomList
                    listId={gameModesListId}
                    listContent={gameModes}
                    getItemLabel={(gameMode) => gameMode.name}
                    buttons={["addBtn"]}
                    onButtonInteraction={handleGameModeListInteraction}
                />
            }
        />
    );
};
export default GameContentManagement;
