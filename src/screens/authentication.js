import React from 'react'
import { useNavigate } from 'react-router-dom'
import './authentication.css'

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
})

export default function Authentication({authenticationMode}) {
    const navigate = useNavigate()

    const handleSubmit = () => {
        if (authenticationMode === AuthenticationMode.Login){
            navigate('/signup')
        } else {
            navigate('/signin')
        }
    }


    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{authenticationMode === AuthenticationMode.Register ? 'Create a new account' : 'Login'}</div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <input type='email' placeholder='Email'/>
                </div>
                <div className='input'>
                    <input type='password' placeholder='Password'/>
                </div>
                {authenticationMode === AuthenticationMode.Register && (
                    <div className = 'input'>
                        <input type = 'password' placeholder='Confirm Password' />
                    </div>
                )}
            </div>
                {authenticationMode === 'Login' ? (
                    <div className='signup'>Don't have an account? <span onClick={handleSubmit}>Sign Up</span></div>
                ) : (
                    <div className='signup'>Already have an account? <span onClick={handleSubmit}>Login</span></div>
                )}
            <div className = 'submit-container'>
                <div className = 'login-newAcc-btn'>
                    {authenticationMode === 'Login' ? 'Login' : 'Create an Account'}
                </div>
            </div>
        </div>
            
    );
}