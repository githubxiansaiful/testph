import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";

const RedirectIfAuth = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="py-[150px] text-center">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/profile" />;
    }

    return children;
};

export default RedirectIfAuth;
