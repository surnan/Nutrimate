import React from 'react';
import "./Splash.css"


const SplashGifDiv = () => {
    return (
        <div className="splash-giv-div">
            <img
                src="https://media.giphy.com/media/4bjIKBOWUnVPICCzJc/giphy.gif"
                alt="Loading Animation"
                width="600"
                height="600"
                className='splash_gif'
            />
        </div>
    );
};

export default SplashGifDiv;