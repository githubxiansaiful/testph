import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import auth from "../firebase/firebase.init";
import { useContext, useState } from "react";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import { AuthContext } from "../../providers/AuthProvider";

const Register = () => {

    const { createUser, loginWithGoogle } = useContext(AuthContext);
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null);
    const redirectAfterLogin = useNavigate();


    const handleRegister = e => {
        e.preventDefault();
        const form = e.target;
        const fullName = e.target.fullName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(fullName, email, password);

        if (password.length < 6) {
            setRegisterError('Password should be at least 6 characters');
            return;
        }

        // Reset firebase error
        setRegisterError('');
        setRegisterSuccess('');

        // Setup Firebase
        // createUserWithEmailAndPassword(auth, email, password)
        createUser(email, password)
            .then((result) => {
                console.log(result.user);
                setRegisterSuccess('User created successfully.');
                form.reset();

                // Update user full name
                updateProfile(result.user, {
                    displayName: fullName,
                })
                    .then(() => {
                        console.log('profle name updated');
                    })
                    .catch(() => {

                    })
            })
            .catch((error) => {
                // console.log(error);
                setRegisterError(error.message)
            })
    }

    // Setup Google Login
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

    return (
        <div className='auth-page register-page'>
            <div className="container">
                <div>
                    <div className='auth-content-area'>
                        <h1 className='text-3xl lg:text-4xl font-bold text-center'>Create Account ✨</h1>
                        <div className='login-buttons mt-5 mb-10'>
                            <button onClick={handleGoogleSignIn}>
                                <img src="/google.svg" />
                                <span className="text-[16px] font-medium">Join with Google</span>
                            </button>
                            <button>
                                <img src="/facebook.svg" />
                                <span className="text-[16px] font-medium">Join with Facebook</span>
                            </button>
                            <button>
                                <img src="/twitter.svg" />
                                <span className="text-[16px] font-medium">Join with X(Twitter)</span>
                            </button>
                        </div>
                        <div className='or-login-with-email'>
                            <p>Or, create new account with your email</p>
                        </div>
                        <div className="auth-form">
                            <form onSubmit={handleRegister}>
                                <div className="single-input">
                                    <label>Name</label>
                                    <input type="text" name="fullName" placeholder="your full name" required />
                                </div>
                                <div className="single-input">
                                    <label>Email</label>
                                    <input type="email" name="email" required placeholder="name@email.com" />
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
                                {
                                    registerError && <div role="alert" className="alert alert-error alert-soft mb-5">
                                        <span>{registerError}</span>
                                    </div>
                                }
                                {
                                    registerSuccess && <div role="alert" className="alert alert-success alert-soft mb-5">
                                        <span>{registerSuccess} 👍</span>
                                    </div>
                                }
                                <div className="form-submit-btn">
                                    <button>Create New Account</button>
                                </div>
                            </form>
                        </div>
                        <div className="text-center my-3">
                            <p>By joining, you agree to our <Link to="/privacy-policy" className="underline">Privacy Policy</Link> and <Link to="/terms-conditions" className="underline">Terms of Service</Link></p>
                        </div>
                        <div className='mt-5 text-center'>
                            <p className='text-[#4a4a4a] font-semibold'>Already have an account? <Link to="/login" className='text-black underline'>Log in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;