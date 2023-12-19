// ImageExpander.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ImageExpanderProps {
    imageUrl: string;
}

const ImageExpander: React.FC<ImageExpanderProps> = ({ imageUrl }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const overlayRef = useRef(null);

    const handleExpandClick = () => {
        setIsExpanded(true);
    };

    const handleCloseClick = () => {
        setIsExpanded(false);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        // Check if the click occurred outside the image container
        if (overlayRef.current && overlayRef.current === e.target) {
            handleCloseClick();
        }
    };

    useEffect(() => {
        // Add event listener to the overlay when the component mounts
        if (isExpanded) {
            document.addEventListener('click', handleOverlayClick as unknown as (e: MouseEvent) => void);
        }

        // Remove event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleOverlayClick as unknown as (e: MouseEvent) => void);
        };
    }, [isExpanded]);

    return (
        <div className="relative">
            <div className="w-full h-full">
                <img
                    src={imageUrl}
                    alt="Expanded Image"
                    className={`w-full h-full object-cover cursor-pointer rounded-lg ${isExpanded ? 'hidden' : 'block'
                        }`}
                    onClick={handleExpandClick}
                />
            </div>

            {isExpanded && (
                <div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75"
                    ref={overlayRef}
                >
                    <div className="relative max-w-screen-md mx-auto">
                        <img
                            src={imageUrl}
                            alt="Expanded Image"
                            className="w-full h-auto"
                        />
                        <button
                            className="absolute top-0 right-0 p-4 text-black"
                            onClick={handleCloseClick}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageExpander;
