import React, {useContext} from 'react';

/** Assets **/
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";

import { LoadGameContext } from '../../contextAPI/LoadGameContext';

const GameButtonRow = ({handleHint, handleReset, handleVerify}) => {
    const { availableHints } = useContext(LoadGameContext);

    return (
        <div className="buttonRow">
            <button
                className="resetButton"
                onClick={handleReset}
            >
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IoMdCloseCircleOutline style={{ marginRight: "5px" }} name="help-outline" size={30} />Borrar
                </span>
            </button>

            <button
                style={{ width: 'fit-content' }}
                onClick={handleHint}
                disabled={!availableHints}
            >
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FaRegQuestionCircle style={{ marginRight: "5px" }} name="help-outline" size={30} />Ayuda
                </span>
            </button>

            <button
                className="verifyButton"
                style={{ width: 'fit-content' }}
                onClick={handleVerify}
            >
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FaRegCheckCircle style={{ marginRight: "5px" }} name="help-outline" size={30} />Verificar
                </span>
            </button>
        </div>
    );
};

export default GameButtonRow;
