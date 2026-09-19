import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg, dur) => addToast(msg, 'success', dur),
        error: (msg, dur) => addToast(msg, 'error', dur),
        warning: (msg, dur) => addToast(msg, 'warning', dur),
        info: (msg, dur) => addToast(msg, 'info', dur)
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    pointerEvents: 'none'
                }}
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        style={{
                            pointerEvents: 'auto',
                            minWidth: '280px',
                            maxWidth: '420px',
                            padding: '14px 20px',
                            borderRadius: '12px',
                            background: t.type === 'success' ? '#10b981' :
                                        t.type === 'error' ? '#ef4444' :
                                        t.type === 'warning' ? '#f59e0b' : '#3b82f6',
                            color: '#ffffff',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                            fontFamily: 'var(--font-body, sans-serif)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>
                                {t.type === 'success' && '✓'}
                                {t.type === 'error' && '✕'}
                                {t.type === 'warning' && '⚠'}
                                {t.type === 'info' && 'ℹ'}
                            </span>
                            <span>{t.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(t.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                padding: '0 4px',
                                lineHeight: 1
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
