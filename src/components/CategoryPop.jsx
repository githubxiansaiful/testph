import { useEffect, useState } from "react";

const CategoryPop = ({ show, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetch("https://photoshub-server.vercel.app/images")
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error loading categories:", err);
                setIsLoading(false);
            });
    }, [])

    console.log(categories);

    return (
        <div className="category-popup-overlay" onClick={onClose}>
            <div
                className={`categor-popup-content ${show ? 'showcat-popup' : ''}`}
                onClick={(e) => e.stopPropagation()} // prevent closing on content click
            >
                <div className="border-b border-[#ddd] px-5 py-2 flex justify-between items-center">
                    <p className="font-bold">
                        Categories{" "}
                        {
                            isLoading ? (
                                <span className="ml-2 loading loading-dots loading-sm"></span>
                            ) : (
                                <span className="bg-[#80008052] px-2 rounded-[5px] text-black font-normal">
                                    {categories.length}
                                </span>
                            )
                        }
                    </p>
                    <button onClick={onClose} className="border border-[#ddd] hover:bg-[#ddd] duration-[.3s] rounded-[10px] px-4 py-2 cursor-pointer">
                        Close
                    </button>
                </div>
                <ul className="category-items">
                    {
                        isLoading ? (
                            <div className="h-[80vh] flex items-center justify-center">
                                <span className="loading loading-spinner loading-xl"></span>
                            </div>
                        ) : (
                            categories.map((category, index) => (
                                <li key={index}>{category.category}</li>
                            ))
                        )
                    }
                </ul>
            </div>
        </div>
    );
};

export default CategoryPop;