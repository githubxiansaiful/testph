import { useContext, useEffect, useRef, useState } from "react";
import { ChevronDown, CloudUpload, GripHorizontal, LogOut, Settings, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Nav = ({ onOpenCategory }) => {
    const { user, logOut, loading } = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuWrapperRef = useRef(null);

    const toggleMobileMenu = () => {
        const newState = !mobileMenuOpen;
        console.log("Toggling menu:", newState); // ✅ Debug
        setMobileMenuOpen(newState);

        if (newState) {
            document.body.classList.add("mobile-menu-active");
            console.log("Class added:", document.body.className); // ✅ Debug
        } else {
            document.body.classList.remove("mobile-menu-active");
            console.log("Class removed");
        }
    };

    // Logout User handler
    const handleLogOut = () => {
        logOut()
            .then(() => {
                console.log('User logged out successfully.');
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileMenuOpen &&
                menuWrapperRef.current &&
                !menuWrapperRef.current.contains(event.target)
            ) {
                setMobileMenuOpen(false);
                document.body.classList.remove("mobile-menu-active");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);

            // ✅ Only remove class if menu is open
            if (mobileMenuOpen) {
                document.body.classList.remove("mobile-menu-active");
            }
        };
    }, [mobileMenuOpen]);


    return (
        <header className="bg-white border-b border-[#f1f1f1] py-3 main-nav relative">
            <div className="container">
                <div className="flex justify-between items-center">
                    <div className="max-w-[120px]">
                        <Link to="/"><img src="/logo.png" alt="photoshub" /></Link>
                    </div>
                    <div ref={menuWrapperRef} className="flex items-center gap-3">
                        {/* Mobile Menu */}
                        <ul className={`nav-menu-items fixed top-[75px] lg:top-[unset] right-0 bg-white z-50 transition-all duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} h-screen w-[300px] max-w-full md:static md:h-auto md:w-auto md:flex md:translate-x-0 nav-ul-lists`}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="#" onClick={onOpenCategory}>Categories</Link></li>
                            <li><Link to="/license">License</Link></li>
                            <li className="has-sub-menu">
                                <a href="#" className="flex items-center gap-1">More <ChevronDown /></a>
                                <ul className="sub-menu pl-4">
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><Link to="/faq">FAQ</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                </ul>
                            </li>
                        </ul>

                        {/* Right Buttons */}
                        <div className="flex gap-3 nav-right-buttons items-center">
                            {loading ? (
                                <span className="loading loading-ring loading-xl"></span>
                            ) :
                                user ?
                                    <>
                                        <div className="user-profile-container has-sub-menu">
                                            <div className="nav-user-profile">
                                                <img src={user?.photoURL || "/user.png"} alt="user" />
                                            </div>
                                            <ul className="sub-menu pl-4 user-submenu-panel">
                                                <li><a href="/profile" className="flex gap-2 items-center"><UserRound /> <span>Your Profile</span></a></li>
                                                <li><a href="/upload-image" className="flex gap-2 items-center"><CloudUpload /> <span>Upload</span></a></li>
                                                <li><a href="/user-settings" className="flex gap-2 items-center"><Settings /> <span>Settings</span></a></li>
                                                <li><a href="#" onClick={handleLogOut} className="flex gap-2 items-center"><LogOut /> <span>Log Out</span></a></li>
                                            </ul>
                                        </div>
                                        <Link to="/upload-image" className="nav-btn upload-btn">Upload</Link>
                                    </>
                                    :
                                    <><Link to="/login" className="nav-btn">Login</Link></>
                            }
                            <button className="mobile-navigation-btn" onClick={toggleMobileMenu}>
                                {mobileMenuOpen ? <X /> : <GripHorizontal />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Nav;
