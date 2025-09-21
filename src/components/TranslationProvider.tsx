import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import useTranslation, { TranslationContextType } from '@/hooks/useTranslation';

// Create context with default values
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ 
  children, 
  defaultLanguage = 'en' 
}) => {
  const translation = useTranslation(defaultLanguage);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...translation
  }), [translation]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};

// Higher Order Component for class components
export const withTranslation = <P extends object>(
  WrappedComponent: React.ComponentType<P & { translation: TranslationContextType }>
): React.FC<P> => {
  const WithTranslation: React.FC<P> = (props) => {
    const translation = useTranslationContext();
    return <WrappedComponent {...props} translation={translation} />;
  };
  
  // Set a display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithTranslation.displayName = `withTranslation(${displayName})`;
  
  return WithTranslation;
};

export default TranslationProvider;
