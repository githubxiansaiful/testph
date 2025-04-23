import Nav from "../layout/Nav";
import Footer from "../layout/Footer";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import CategoryPop from "../components/CategoryPop";

const Main = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>
            <Toaster position="bottom-left" reverseOrder={false} />
            <ScrollToTop />
            <div className="header-area">
                <Nav onOpenCategory={() => setShowPopup(true)} />
            </div>
            <div className="main-content">
                <Outlet />
            </div>
            {showPopup && (
                <CategoryPop show={showPopup} onClose={() => setShowPopup(false)} />
            )}
            {!isHomePage && (
                <div className="footer-area">
                    <Footer />
                </div>
            )}
        </div>
    );
};

export default Main;
