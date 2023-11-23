import React, {ChangeEvent, KeyboardEvent} from 'react';

type InputPropsType = {
    value: string
    onChangeCallback?: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyDownCallback?: (e: KeyboardEvent<HTMLInputElement>) => void
    error?: string | null
    onBlurCallback?: () => void
    disabled?:boolean
}

export const Input = React.memo((props: InputPropsType) => {

        const oncChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            if (props.onChangeCallback) {
                props.onChangeCallback(e)
            }
        }
        const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (props.onKeyDownCallback) {
                props.onKeyDownCallback(e);
            }
        }

        const onBlurHandler = () => {
            if (props.onBlurCallback) {
                props.onBlurCallback()
            }
        }

        return (
            <input
                disabled={props.disabled}
                className={props.error ? 'error' : ''}
                value={props.value}
                onKeyDown={onKeyDownHandler}
                onChange={oncChangeHandler}
                onBlur={onBlurHandler}
                autoFocus
            />
        );
    }
)
