import React from 'react';

export const ChatNameCard: React.FC = () => {
    return (
        <div className="relative flex items-center border-primary hover:bg-hoverBg hover:cursor-pointer p-1 gap-5 h-12 max-w-full mb-2">
            <div className="basis-1/5 relative h-full flex items-center">
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src="https://avatar.iran.liara.run/public/boy"
                        alt=""
                        className="rounded-8 object-contain w-full h-full"
                    />
                    <span className="absolute text-green-500 top-0 right-0">
                        <svg width="15" height="15">
                            <circle cx="6" cy="6" r="6" fill="currentColor"></circle>
                        </svg>
                    </span>
                </div>
            </div>
            <div className="basis-4/5 flex flex-col justify-center">
                <div className="text-sm text-secondary">
                    <span>Quang Tran</span>
                </div>
                <span>Enasdnasod aksjdklasd đá ....</span>
            </div>
        </div>
    );
};
