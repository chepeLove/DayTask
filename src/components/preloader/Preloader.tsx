import React from 'react';
import preloader from "../../assets/spinner-preloaderx.svg";

export const Preloader = () => {
    return (
        <div>
            <img src={preloader} alt ={'preloader'}/>
        </div>
    );
};
