import {useFormik} from 'formik';
import React from 'react';
import {useAppDispatch, useAppSelector} from "../../store/hooks/hooks";
import {loginTC} from "../../reducers/auth-reducer";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {

    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Email is required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Password is required'
            } else if (values.password.length < 8) {
                errors.password = 'Password must contain at least 8 characters'
            } else if (!(/[a-zA-Z]/.test(values.password))) {
                errors.password = 'The password must contain at least one letter'
            } else if (!(/\d/.test(values.password))) {
                errors.password = 'The password must contain at least one number'
            }
            return errors
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })

    if(isLoggedIn){
        return  <Navigate to={'/'}/>
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input id={'email'}
                       type="email"
                       {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div style={{color: 'red'}}>{formik.errors.email}</div>) : null}

                <label htmlFor="password">Password:</label>
                <input id={'password'}
                       type="password"
                       {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div style={{color: 'red'}}>{formik.errors.password}</div>) : null}

                <label htmlFor="rememberMe">
                    <input type="checkbox"
                           id={'rememberMe'}
                           name={'rememberMe'}
                           onChange={formik.handleChange}
                           checked={formik.values.rememberMe}
                    />
                    <span>remember me</span>
                </label>
                <button type={'submit'}>Log in</button>
            </form>
        </>
    );
};

