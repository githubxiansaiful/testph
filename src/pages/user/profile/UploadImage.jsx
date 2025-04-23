import { X } from "lucide-react";
import { useContext, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";

const UploadImage = () => {
    const [popupImage, setPopupImage] = useState(null); // for preview popup
    const [loading, setLoading] = useState(false);
    const formRef = useRef();
    const { user } = useContext(AuthContext);

    const [imageInputs, setImageInputs] = useState([
        {
            id: Date.now(),
            url: "",
            valid: false,
            title: "",
            category: "",
            tag: "",
        },
    ]);

    // 🔍 On image URL change, call the image recognition API:
    const analyzeImage = async (url) => {
        try {
            const res = await fetch("https://api.imagga.com/v2/tags?image_url=" + encodeURIComponent(url), {
                headers: {
                    Authorization: "Basic " + btoa("acc_16e964c30deaa75:ab6326c12d0a7ad9886889c35c2727c3")
                }
            });

            const data = await res.json();

            if (!data.result || !data.result.tags) {
                console.error("Image analysis failed:", data);
                return {
                    title: "",
                    category: "",
                    tag: "",
                };
            }

            const topTags = data.result.tags.slice(0, 3).map(t => t.tag.en);

            return {
                title: topTags[0] || "",
                category: topTags[1] || "General",
                tag: topTags.join(", ") || "",
            };
        } catch (error) {
            console.error("Image metadata error:", error);
            return {
                title: "",
                category: "",
                tag: "",
            };
        }
    };


    // 🔄 Update form automatically:
    const handleImageUrlChange = async (index, value) => {
        const newInputs = [...imageInputs];
        newInputs[index].url = value;

        const img = new Image();
        img.onload = async () => {
            newInputs[index].valid = true;

            // 🎯 Auto-generate metadata
            const meta = await analyzeImage(value);
            newInputs[index].title = meta.title;
            newInputs[index].category = meta.category;
            newInputs[index].tag = meta.tag;

            setImageInputs([...newInputs]);
        };
        img.onerror = () => {
            newInputs[index].valid = false;
            setImageInputs([...newInputs]);
        };
        img.src = value;

        setImageInputs(newInputs);
    };


    const handleAddNewImage = () => {
        if (imageInputs.length < 5) {
            setImageInputs([...imageInputs, { id: Date.now(), url: "", valid: false }]);
        }
    };

    const openPopup = (url) => {
        if (url) setPopupImage(url);
    };

    const closePopup = () => {
        setPopupImage(null);
    };

    const handleInputChange = (index, field, value) => {
        const newInputs = [...imageInputs];
        newInputs[index][field] = value;
        setImageInputs(newInputs);
    };




    // Send image to server
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validImages = imageInputs.filter((img) => img.valid && img.url);
        if (validImages.length === 0) {
            return toast.error("Please enter at least one valid image URL.");
        }

        setLoading(true);

        const uploadPromise = new Promise((resolve, reject) => {
            fetch("https://photoshub-server.vercel.app/stock-photos-hub", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    images: validImages.map(img => ({
                        url: img.url,
                        title: img.title,
                        category: img.category,
                        tag: img.tag,
                    })),
                    user: {
                        displayName: user?.displayName,
                        email: user?.email,
                        photoURL: user?.photoURL,
                    },
                }),
            })
                .then(async (res) => {
                    const data = await res.json();
                    setTimeout(() => {
                        if (res.ok) resolve(data);
                        else reject(data);
                    }, 10);
                })
                .catch((err) => {
                    setTimeout(() => reject(err), 2000);
                });
        });

        toast.promise(uploadPromise, {
            loading: "Uploading...",
            success: "Upload successful!",
            error: "Upload failed. Try again!",
        });

        try {
            const data = await uploadPromise; // already parsed JSON
            // ✅ reset form after success
            setImageInputs([{ id: Date.now(), url: "", valid: false, title: "", category: "", tag: "", description: "" }]);
            setPopupImage(null);
            formRef.current?.reset(); // optional, mostly visual
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };



    return (
        <div className="my-10">
            <div className="container">
                <div className="flex w-[210px] h-[105px] m-auto">
                    <img src="/cam-icons.jpg" alt="" />
                </div>
                <div className="mt-5 mb-5">
                    <h1 className="text-center font-bold text-2xl lg:text-3xl">Upload Image</h1>
                </div>

                <div className="img-upload-form-container">
                    <form onSubmit={handleSubmit} className="image-upload-form space-y-5">
                        {imageInputs.map((input, index) => (
                            <div className="bg-[#f1f1f1e6] p-5 rounded-2xl" key={input.id}>
                                <div className="image-url-preview">
                                    <div className="preview-image cursor-pointer" onClick={() => openPopup(input.valid ? input.url : null)}>
                                        <img
                                            src={input.valid ? input.url : "/landscape-placeholder.svg"}
                                            alt="Preview"
                                        />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="Type or Paste valid image URL"
                                        value={input.url}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                        className="w-full border p-2"
                                    />
                                </div>

                                {/* Metadata Inputs */}
                                <div className="image-metadata-inputs">
                                    <p>Meta Data</p>
                                    <input
                                        type="text"
                                        placeholder="Title (optional)"
                                        value={input.title}
                                        onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                                        className="w-full border p-2 mt-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Category (optional)"
                                        value={input.category}
                                        onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                                        className="w-full border p-2 mt-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tags (optional)"
                                        value={input.tag}
                                        onChange={(e) => handleInputChange(index, 'tag', e.target.value)}
                                        className="w-full border p-2 mt-2"
                                    />
                                </div>
                            </div>
                        ))}

                        {imageInputs.length < 5 && (
                            <div className="add-new-image cursor-pointer text-blue-500" onClick={handleAddNewImage}>
                                <p>Add New Image</p>
                            </div>
                        )}

                        <div className="upload-image-btn">
                            <button type="submit" disabled={loading} className="flex items-center gap-2">
                                {loading ? (
                                    <>
                                        Uploading Image <span className="loading loading-spinner loading-sm"></span>
                                    </>
                                ) : (
                                    "Upload Image"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Modal Preview */}
            {popupImage && (
                <div
                    className="fixed inset-0 bg-[#000000c9] bg-opacity-70 flex items-center justify-center z-50"
                    onClick={closePopup}
                >
                    <div className="relative bg-white p-4 rounded shadow-lg max-w-xl" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-7 h-7 flex items-center justify-center"
                            onClick={closePopup}
                        >
                            <X />
                        </button>
                        <img src={popupImage} alt="Full Preview" className="max-w-full max-h-[80vh] rounded" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadImage;
