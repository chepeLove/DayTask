import React, {ChangeEvent} from 'react';

type CheckBoxPropsType = {
    checked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export const CheckBox = (props:CheckBoxPropsType) => {

    return (
        <>
            <input type="checkbox" onChange={props.onChange} checked={props.checked}/>
        </>
    );
};
