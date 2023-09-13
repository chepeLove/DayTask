import React, {ChangeEvent, KeyboardEvent} from 'react';

type InputPropsType = {
    value?: string
    onChangeCallback: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyDownCallback?: (e: KeyboardEvent<HTMLInputElement>) => void
    error?: string | null
}

export const Input = (props: InputPropsType) => {

    const oncChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.onChangeCallback(e)
    }
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (props.onKeyDownCallback) {
            props.onKeyDownCallback(e);
        }
    }

    return (
        <input
            className={props.error ? 'error' : ''}
            value={props.value}
            onKeyDown={onKeyDownHandler}
            onChange={oncChangeHandler}
        />
    );
};
