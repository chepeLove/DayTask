import React from 'react';
import s from './LinearProgress.module.css'
export const LinearProgress = () => {
    return (
        <div className={s.container}>
            <div className={s.loader}></div>
        </div>
    );
};
