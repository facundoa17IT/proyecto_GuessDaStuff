import React from 'react';
//import BackButton from '../ui/BackButton'
//import PropTypes from 'prop-types';
import '../../styles/main-game-layout.css'
const MainGameLayout = ({
    leftContent,
    middleContent,
    rightContent,
    middleHeader = "-",
    leftHeader = "-",
    rightHeader = "-",
    middleFlexGrow = 2,
    extraClass,
    //canGoBack = true,
    hideLeftPanel = false,
    hideRightPanel = false,
}) => {
    return (
        <div className={`main-game-layout-cointainer`}>
            {!hideLeftPanel && <div className="left-div">
                <h1>{leftHeader}</h1>
                {leftContent}
                {/* {canGoBack && <BackButton />} */}
            </div>}
            <div className={`middle-div ${extraClass}`} style={{ flexGrow: middleFlexGrow }}>
                <h1>{middleHeader}</h1>
                {middleContent}
            </div>
            {!hideRightPanel && <div className="right-div">
                <h1>{rightHeader}</h1>
                {rightContent}
            </div>}
        </div>
    );
};

// MainGameLayout.propTypes = {
//     leftContent: PropTypes.node,
//     middleContent: PropTypes.node,
//     rightContent: PropTypes.node,
//     middleHeader: PropTypes.string,
//     leftHeader: PropTypes.string,
//     rightHeader: PropTypes.string,
//     middleFlexGrow: PropTypes.number,
//     extraClass: PropTypes.string,
//     //canGoBack: PropTypes.bool,
//     hideLeftPanel: PropTypes.bool,
//     hideRightPanel: PropTypes.bool,
// };


export default MainGameLayout;
