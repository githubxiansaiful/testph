import { useEffect, useState } from "react";

const MasonryImage = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);
    const [imgHeight, setImgHeight] = useState(0);
    const [bgColor, setBgColor] = useState("#eee");

    // Generate a soft pastel color
    const getRandomSoftColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 60%, 85%)`; // soft pastel tones
    };

    useEffect(() => {
        const img = new Image();
        img.src = src;

        // Set soft color once per component
        setBgColor(getRandomSoftColor());

        img.onload = () => {
            setImgHeight(img.height);
            setTimeout(() => {
                setLoaded(true);
            }, 1000); // Simulated load time
        };
    }, [src]);

    return (
        <div className="img-box-inner" style={{ position: "relative" }}>
            {!loaded && (
                <div
                    className="image-loader"
                    style={{
                        height: imgHeight ? `${imgHeight}px` : "200px",
                        background: bgColor,
                    }}
                ></div>
            )}
            {loaded && (
                <img
                    src={src}
                    alt={alt}
                    style={{ width: "100%", borderRadius: "10px" }}
                />
            )}
        </div>
    );
};

export default MasonryImage;
