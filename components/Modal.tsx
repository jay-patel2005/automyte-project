"use client";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

const Modal = ({ isOpen, onClose, title, description }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-bg/80 backdrop-blur-md">
            <div className="glass-morphism max-w-lg w-full p-8 rounded-twelve border border-brand-accent/50 relative">
                <button
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </button>
                <div>
                    <h3 className="text-2xl font-bold text-brand-accent mb-4">{title}</h3>
                    <p className="text-slate-300 leading-relaxed">{description}</p>
                    <button
                        onClick={onClose}
                        className="mt-8 px-6 py-2 bg-brand-accent text-brand-bg font-bold rounded-twelve w-full"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
