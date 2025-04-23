import { useEffect, useState } from "react";
import MasonryImage from "./MasonryImage";
import OpenImgPopup from "./OpenImgPopup.jsx";


const Images = () => {
    const [images, setImages] = useState([]);
    const [visibleCount, setVisibleCount] = useState(50);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        fetch("https://photoshub-server.vercel.app/stock-photos-hub")
            .then(res => res.json())
            .then(data => {
                setImages(data);
                setIsLoading(false); // Set loading state to false when data is fetched
            })
            .catch(err => {
                console.error("Error loading images:", err);
                setIsLoading(false); // Handle error and stop loading
            });
    }, []);

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
            if (scrollBottom && !loadingMore && visibleCount < images.length) {
                setLoadingMore(true);
                setTimeout(() => {
                    setVisibleCount(prev => prev + 50);
                    setLoadingMore(false);
                }, 1500); // simulate loading delay
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [images, visibleCount, loadingMore]);

    const handleImageClick = (img, index) => {
        setSelectedImage(img);
        setSelectedIndex(index);
        setShowPopup(true);
        console.log("click");
    };
    const handlePrev = () => {
        if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            setSelectedIndex(newIndex);
            setSelectedImage(images[newIndex]);
        }
    };

    const handleNext = () => {
        if (selectedIndex < images.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedIndex(newIndex);
            setSelectedImage(images[newIndex]);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedImage(null);
    };

    return (
        <>
            {isLoading ? (  // Conditionally render the loading spinner based on loading state
                <div className="h-[80vh] flex items-center justify-center"><span className="loading loading-spinner loading-xl"></span></div>
            ) : (
                <div className="my-10 all-images">
                    {/* {images.slice(0, visibleCount).map((img, index) => (
                        <div key={index} className="img-box">
                            <MasonryImage src={img.imgUrl} alt={img.title || `Image ${index + 1}`} />
                        </div>
                    ))} */}
                    {images.slice(0, visibleCount).map((img, index) => (
                        <div key={index} className="img-box cursor-pointer" onClick={() => handleImageClick(img, index)}>
                            <MasonryImage src={img.imgUrl} alt={img.title || `Image ${index + 1}`} />
                        </div>
                    ))}
                </div>
            )}
            <div>
                {loadingMore && (
                    <div className="text-center my-5">
                        <p className="text-center">Loading</p>
                        <span className="loading loading-ring loading-xl"></span>
                    </div>
                )}
            </div>
            {showPopup && (
                <OpenImgPopup
                    image={selectedImage}
                    onClose={handleClosePopup}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    isFirst={selectedIndex === 0}
                    isLast={selectedIndex === images.length - 1}
                />
            )}
        </>
    );
};

export default Images;
