import { useEffect } from "react";
import { ChevronLeft, ChevronRight, CircleX, Heart } from "lucide-react";

const OpenImgPopup = ({ image, onClose, onPrev, onNext, isFirst, isLast }) => {
    if (!image) return null;

    // Handle Escape key to close popup
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft" && !isFirst) {
                onPrev();
            } else if (e.key === "ArrowRight" && !isLast) {
                onNext();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, onPrev, onNext, isFirst, isLast]);


    return (
        <div
            className="image-popup-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Image uploaded by ${image.user.displayName}`}
        >
            <div
                className="image-popup-container relative"
                onClick={(e) => e.stopPropagation()}
            >


                {/* Prev Button */}
                {!isFirst && (
                    <button
                        onClick={onPrev}
                        className="ml-[-15px] absolute bg-[#f1f1f1] rounded-full left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50"
                        aria-label="Previous image"
                    >
                        <ChevronLeft color="black" size={30} className="cursor-pointer" />
                    </button>
                )}

                {/* Next Button */}
                {!isLast && (
                    <button
                        onClick={onNext}
                        className="mr-[-15px] absolute bg-[#f1f1f1] rounded-full right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-50"
                        aria-label="Next image"
                    >
                        <ChevronRight color="black" size={30} className="cursor-pointer" />
                    </button>
                )}

                {/* Image and Info */}
                <div className="img-popup-nav mb-7">
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center hidden">
                            <div className="w-[50px] h-[50px]">
                                <img src={image.user.photoURL} className="rounded-full" alt={`${image.user.displayName} avatar`} />
                            </div>
                            <div className="">
                                <h3 className="text-[14px] lg:text-xl font-bold">{image.user.displayName}</h3>
                                <p className="text-[#7f7f7f] text-[8px] lg:text-[16px] font-semibold -mt-[5px]">Uploader</p>
                            </div>
                        </div>
                        <div className="img-popup-nav-buttons">
                            <button className="give-like-image" aria-label="Like this image"><Heart /> 150</button>
                            <button
                                onClick={onClose}
                                className="popup-close-button"
                                aria-label="Close image popup">
                                <CircleX  color="black" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="popup-image-value">
                    <img src={image.imgUrl} alt={`Uploaded image by ${image.user.displayName}`} />
                </div>
            </div>
        </div>
    );
};

export default OpenImgPopup;
