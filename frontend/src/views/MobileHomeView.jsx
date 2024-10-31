/** React **/
import React from 'react';

/** Assets **/
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaAppStoreIos } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaAndroid } from "react-icons/fa";
import { RiComputerLine } from "react-icons/ri";
import { MdLaptopChromebook } from "react-icons/md";

const MobileHomeView = () => {
    return (
        <div style={{ marginTop: '10%', paddingBottom: '15px' }}>
            <h3>Descarga la aplicacion desde <br />tu Movil o Tablet</h3>
            <small>Disponible en <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaAndroid fontSize={20} style={{ marginRight: '5px', color: 'var(--link-color)' }} />Android y <FaApple fontSize={20} style={{ marginLeft: '3px', marginRight: '5px', color: 'var(--link-color)' }} />IOS</span></small>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                <button style={{ width: '200px' }}><span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IoLogoGooglePlaystore fontSize={30} style={{ marginRight: '10px' }} />Google Play</span></button>
                <button style={{ width: '200px' }}><span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaAppStoreIos fontSize={30} style={{ marginRight: '10px' }} />App Store</span></button>
                <div style={{ marginTop: '1%', padding: '5px', backgroundColor: 'var(--background-color)' }}>
                    <p>Version Web disponible para <br /><RiComputerLine /> Escritorio y <MdLaptopChromebook /> Notebook</p>
                </div>
            </div>
        </div>
    );
};

export default MobileHomeView;
