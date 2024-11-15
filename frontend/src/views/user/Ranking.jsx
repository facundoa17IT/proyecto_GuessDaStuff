/** React **/
import React from 'react';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout'
import CustomList from '../../components/layouts/CustomList';

const Ranking = () => {

    return (
        <MainGameLayout
            hideLeftPanel={true}
            hideRightPanel={true}
            middleHeader='Ranking'
            middleContent={
                <CustomList
                    listId={"rankingList"}
                    // listContent={null}
                    // getItemLabel={}
                    // buttons={['infoBtn']}
                    // onButtonInteraction={}
                />
            }
        />
    );
};

export default Ranking;