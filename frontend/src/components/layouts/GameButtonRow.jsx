import React, { useContext } from 'react';

/** Hooks **/
import useResponsiveBreakpoint from '../../hooks/useResponsiveBreakpoint';

/** Assets **/
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";

import { LoadGameContext } from '../../contextAPI/LoadGameContext';

const GameButtonRow = ({ handleHint, handleReset, handleVerify, hideReset = false }) => {
    const { availableHints } = useContext(LoadGameContext);

    const { isDesignBreakpoint, isMobile, isMediumDevice } = useResponsiveBreakpoint();

    return (
        <div className="buttonRow">
            {!hideReset && <button
                className="resetButton"
                onClick={handleReset}
            >
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IoMdCloseCircleOutline style={{ marginRight: "5px" }} name="help-outline" size={30} />{isMobile ? "" : "Borrar"}
                </span>
            </button>}

            <button
                onClick={handleHint}
                disabled={!availableHints}
            >
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FaRegQuestionCircle style={{ marginRight: "5px" }} name="help-outline" size={30} />{isMobile ? "" : "Ayuda"}
                </span>
            </button>

            <button
                className="verifyButton"
                onClick={handleVerify}
            >
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FaRegCheckCircle style={{ marginRight: "5px" }} name="help-outline" size={30} />{isMobile ? "" : "Verificar"}
                </span>
            </button>
        </div>
    );
};

export default GameButtonRow;
