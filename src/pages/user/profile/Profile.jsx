import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";

const Profile = () => {

    const { user } = useContext(AuthContext);

    return (
        <div>
            <div className="container">
                <div className="bg-[#f1f1f1] my-5 py-5 rounded-2xl">
                    <div className="flex items-center justify-center w-[130px] h-[130px] mx-auto">
                        <img src={user?.photoURL || "/user.png"} alt="User Profile" className="rounded-[50%] h-full w-full object-cover" />
                    </div>
                    <div className="mt-5">
                        <h1 className="text-center text-3xl lg:text-5xl font-bold">{user?.displayName || "User Name"}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;