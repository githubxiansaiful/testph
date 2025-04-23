import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import auth from "../firebase/firebase.init";
import { useState } from "react";

const ForgetPassword = () => {

    const [passwordResetSend, setPasswordResetSend] = useState('');
    const [passwordResetFailed, setPasswordResetFailed] = useState('');

    const handleForgetPassword = e => {
        e.preventDefault();
        const form = e.target;
        const email = e.target.email.value;
        setPasswordResetSend('');
        setPasswordResetFailed('');

        // Setup firebase reset password function
        sendPasswordResetEmail(auth, email)
            .then((result) => {
                setPasswordResetSend('Please check your email to reset password.');
                form.reset();
            })
            .catch((error) => {
                setPasswordResetFailed('Invalid email, please check your email.');
            })
    }

    return (
        <div className='auth-page rest-password'>
            <div className="container">
                <div>
                    <div className='auth-content-area'>
                        <h1 className='text-3xl lg:text-4xl font-bold text-center'>Forgotten password?</h1>
                        <div className="auth-form">
                            <form onSubmit={handleForgetPassword}>
                                <div className="single-input">
                                    <label>Enter your email address                                    </label>
                                    <input type="email" name="email" required placeholder="address@email.com" />
                                </div>
                                {
                                    passwordResetFailed && <div role="alert" className="alert alert-error alert-soft mb-5">
                                        <span>{passwordResetFailed}</span>
                                    </div>
                                }
                                {
                                    passwordResetSend && <div role="alert" className="alert alert-success alert-soft mb-5">
                                        <span>{passwordResetSend}</span>
                                    </div>
                                }
                                <div className="form-submit-btn">
                                    <button>Reset password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;