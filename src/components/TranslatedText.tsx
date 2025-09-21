import React, { useState, useEffect, useMemo } from 'react';
import { useTranslationContext } from '@/components/TranslationProvider';
import { Skeleton } from '@/components/ui/skeleton';

interface TranslatedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The text to be translated */
  children: string;
  
  /** Optional class name for the wrapper span */
  className?: string;
  
  /** Whether to show a loading skeleton while translating */
  showLoadingState?: boolean;
  
  /** Custom loading component to show while translating */
  loadingComponent?: React.ReactNode;
}

/**
 * A component that automatically translates its children text content.
 * Uses the current language from the TranslationContext.
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({
  children,
  className = '',
  showLoadingState = true,
  loadingComponent,
  ...props
}) => {
  const [translatedText, setTranslatedText] = useState(children);
  const [isTranslating, setIsTranslating] = useState(false);
  const { t, currentLang, isLoading: isLangLoading } = useTranslationContext();
  
  // Generate a unique key based on the text and language to force re-translation when either changes
  const translationKey = useMemo(() => {
    return `${currentLang}:${children}`;
  }, [currentLang, children]);

  useEffect(() => {
    let isMounted = true;
    
    const translate = async () => {
      if (!children) return;
      
      setIsTranslating(true);
      try {
        const result = await t(children);
        if (isMounted) {
          setTranslatedText(result);
        }
      } catch (error) {
        console.error('Translation error:', error);
        if (isMounted) {
          setTranslatedText(children); // Fallback to original text on error
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false);
        }
      }
    };

    // Only translate if we're not already doing so and languages are loaded
    if (!isLangLoading) {
      translate();
    }

    return () => {
      isMounted = false;
    };
  }, [translationKey, t, isLangLoading]);
  
  // Show loading state if requested and we're still translating
  if ((isTranslating || isLangLoading) && showLoadingState) {
    return loadingComponent || (
      <Skeleton className={`inline-block h-4 w-24 ${className}`} />
    );
  }

  return (
    <span 
      className={className} 
      data-translated="true"
      data-original-text={children}
      data-lang={currentLang}
      {...props}
    >
      {translatedText}
    </span>
  );
};

export default TranslatedText;
