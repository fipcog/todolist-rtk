import React from 'react'
import { useFormik } from 'formik'
import { useSelector } from 'react-redux'
import { login } from './auth-slice'
import { AppRootStateType } from '../../app/store'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from '../../common/hooks/useAppDispatch';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from '@mui/material'
import { ResponseType } from 'api/todolists-api';

export const Login = () => {
    const dispatch = useAppDispatch()

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                return {
                    email: 'Email is required'
                }
            }
            if (!values.password) {
                return {
                    password: 'Password is required'
                }
            }

        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: (values, formikHelpers) => {
            dispatch(login(values)).unwrap().catch((data: ResponseType) => {
                if (data.fieldsErrors.length) {
                    data.fieldsErrors.forEach(err => formikHelpers.setFieldError(err.field, err.error))
                }
                if (!data.fieldsErrors.length && data.messages) {
                    formikHelpers.setFieldError('password', data.messages[0])
                }
            })
        },
    })

    if (isLoggedIn) {
        return <Navigate to={"/"} />
    }


    return <Grid container justifyContent="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                target={'_blank'}>here</a>
                        </p>
                        <p>
                            or use common test account credentials:
                        </p>
                        <p> Email: free@samuraijs.com
                        </p>
                        <p>
                            Password: free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
