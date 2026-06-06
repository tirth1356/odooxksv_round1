import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext();

export function useDialog() {
  return useContext(DialogContext);
}

export function DialogProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'alert', // 'alert' or 'prompt'
    title: '',
    message: '',
    defaultValue: '',
    resolve: null
  });

  const [promptValue, setPromptValue] = useState('');

  const showAlert = (message, title = 'Notification') => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        type: 'alert',
        title,
        message,
        resolve
      });
    });
  };

  const showPrompt = (message, defaultValue = '', title = 'Input Required') => {
    return new Promise((resolve) => {
      setPromptValue(defaultValue);
      setDialogState({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        defaultValue,
        resolve
      });
    });
  };

  const handleClose = () => {
    if (dialogState.resolve) {
      dialogState.resolve(dialogState.type === 'prompt' ? null : undefined);
    }
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (dialogState.resolve) {
      dialogState.resolve(dialogState.type === 'prompt' ? promptValue : undefined);
    }
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <DialogContext.Provider value={{ showAlert, showPrompt }}>
      {children}
      
      {dialogState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-title-lg font-bold text-on-surface mb-2">{dialogState.title}</h3>
              <p className="text-body-md text-on-surface-variant mb-6 whitespace-pre-wrap">{dialogState.message}</p>
              
              {dialogState.type === 'prompt' && (
                <input
                  type="text"
                  autoFocus
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-6"
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirm();
                    if (e.key === 'Escape') handleClose();
                  }}
                />
              )}
              
              <div className="flex justify-end gap-3">
                {dialogState.type === 'prompt' && (
                  <button 
                    onClick={handleClose}
                    className="px-4 py-2 text-body-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={handleConfirm}
                  className="px-6 py-2 bg-primary text-on-primary text-body-sm font-bold rounded hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  {dialogState.type === 'prompt' ? 'Confirm' : 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
