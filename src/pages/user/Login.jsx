import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import auth from '../firebase/firebase.init';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../providers/AuthProvider';

const Login = () => {
    const { loginWithPassword, loginWithGoogle } = useContext(AuthContext);
    const redirectAfterLogin = useNavigate();

    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState('');
    const [loginFailed, setLoginFailed] = useState('');

    // Login with Google
    const handleGoogleSignIn = () => {
        loginWithGoogle()
            .then((result) => {
                console.log(result);
                setUser(result.user);
                redirectAfterLogin('/profile');
            })
            .catch((error) => {
                console.log(error);
                setUser(null);
            })
    }

    // Login with email and password
    const handleEmailLogin = e => {
        e.preventDefault();
        const form = e.target;
        const email = e.target.email.value;
        const password = e.target.password.value;
        setLoginSuccess('');
        setLoginFailed('');

        // setup firebase
        loginWithPassword(email, password)
            .then((loginsuccess) => {
                console.log(loginsuccess.user);
                setLoginSuccess('Login Success!');
                form.reset();
                redirectAfterLogin('/profile');
            })
            .catch((error) => {
                setLoginFailed('Invalid-credential, please double check your email and password.')
                console.log(error);
            })

    }


    return (
        <div className='auth-page'>
            <div className="container">
                <div>
                    <div className='auth-content-area'>
                        <h1 className='text-3xl lg:text-4xl font-bold text-center'>Welcome Back 👋</h1>
                        <div className='login-buttons mt-5 mb-10'>
                            <button onClick={handleGoogleSignIn}>
                                <img src="/google.svg" />
                                <span className="text-[16px] font-medium">Log in with Google</span>
                            </button>
                            <button>
                                <img src="/facebook.svg" />
                                <span className="text-[16px] font-medium">Log in with Facebook</span>
                            </button>
                            <button>
                                <img src="/twitter.svg" />
                                <span className="text-[16px] font-medium">Log in with X(Twitter)</span>
                            </button>
                        </div>
                        <div className='or-login-with-email'>
                            <p>Or, log in with your email</p>
                        </div>
                        <div className="auth-form">
                            <form onSubmit={handleEmailLogin}>
                                <div className="single-input">
                                    <label>Email</label>
                                    <input type="email" name="email" required placeholder="address@email.com" />
                                </div>
                                <div className="single-input">
                                    <label>Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            placeholder="••••••••" />
                                        <span className="absolute right-[10px] top-[14px] cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {
                                                showPassword ? <EyeOff /> : <Eye />
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className='mb-5 underline font-semibold'>
                                    <Link to="/forget-password" >Forgot your password?</Link>
                                </div>
                                {
                                    loginFailed && <div role="alert" className="alert alert-error alert-soft mb-5">
                                        <span>{loginFailed}</span>
                                    </div>
                                }
                                {
                                    loginSuccess && <div role="alert" className="alert alert-success alert-soft mb-5">
                                        <span>{loginSuccess} 👍</span>
                                    </div>
                                }
                                <div className="form-submit-btn">
                                    <button>Login</button>
                                </div>
                            </form>
                        </div>
                        <div className='mt-5 text-center'>
                            <p className='text-[#4a4a4a] font-semibold'>Don't have an account? <Link to="/register" className='text-black underline'>Create account</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;