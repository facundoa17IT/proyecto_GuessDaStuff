/** React **/
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

/** Assets **/
import { SlSizeFullscreen } from "react-icons/sl";
import { BsWindowFullscreen } from "react-icons/bs";

/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext'

/** Style **/
import '../../styles/main-game-layout.css';

const MainGameLayout = ({
    leftContent,
    middleContent,
    rightContent,
    middleHeader = "-",
    leftHeader = "-",
    rightHeader = "-",
    middleFlexGrow = 2,
    extraClass,
    hideLeftPanel = false,
    hideRightPanel = false,
}) => {
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { isGameView } = useContext(LoadGameContext);

    const isMobile = useMediaQuery({ query: '(max-width: 450px)' });

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", onFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", onFullscreenChange);
        };
    }, []);

    const enterFullscreen = () => {
        if (containerRef.current) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if (containerRef.current.mozRequestFullScreen) { // Firefox
                containerRef.current.mozRequestFullScreen();
            } else if (containerRef.current.webkitRequestFullscreen) { // Chrome, Safari, and Opera
                containerRef.current.webkitRequestFullscreen();
            } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
                containerRef.current.msRequestFullscreen();
            }
        }
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    };

    return (
        <div className="main-game-layout-cointainer"
            style={{
                height: isGameView
                    ? 'calc(100dvh - 2rem)'
                    : (isMobile && isGameView)
                        ? '100dvh'
                        : 'calc(100dvh - 2rem - 80px)'
            }}
            ref={containerRef}>
            {!hideLeftPanel && (
                <div className="left-div">
                    <h1>{leftHeader}</h1>
                    {leftContent}
                </div>
            )}
            <div className={`middle-div ${extraClass}`} style={{ flexGrow: middleFlexGrow }}>
                <h1>{middleHeader}</h1>
                {middleContent}
            </div>
            {!hideRightPanel && (
                <div className="right-div">
                    <h1>{rightHeader}</h1>
                    {rightContent}
                    {isGameView && <button className='fullscreen-btn' onClick={isFullscreen ? exitFullscreen : enterFullscreen}>
                        {isFullscreen ? <BsWindowFullscreen /> : <SlSizeFullscreen />}
                    </button>}
                </div>
            )}
        </div>
    );
};

export default MainGameLayout;
