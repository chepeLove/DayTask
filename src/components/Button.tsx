import React from 'react';

type ButtonPropsType = {
    name: string
    callBackButton: () => void
    disabled?: boolean
    className?: string
}


export const Button = React.memo((props: ButtonPropsType) => {
        const onClickButtonHandler = () => {
            props.callBackButton()
        }

        return (
            <button className={props.className} onClick={onClickButtonHandler}
                    disabled={props.disabled}>{props.name}</button>
        );
    }
)

