import { useState, useEffect, useRef } from "react";
import { AILoadingManager, LoadingState, LoadingConfig, defaultLoadingConfig } from "@kan/shared";

// Enhanced Progress Button Component
interface ProgressButtonProps {
  isLoading: boolean;
  disabled: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  loadingConfig?: LoadingConfig;
  className?: string;
  onClick?: () => void;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({ 
  isLoading, 
  disabled, 
  children, 
  icon,
  type = "button",
  loadingConfig = defaultLoadingConfig,
  className = "",
  onClick
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null);
  const loadingManagerRef = useRef<AILoadingManager | null>(null);

  useEffect(() => {
    if (isLoading && !loadingManagerRef.current) {
      // Start the loading animation only when actually loading
      loadingManagerRef.current = new AILoadingManager(loadingConfig);
      loadingManagerRef.current.start((state) => {
        // Only update state if still loading to prevent premature completion
        if (isLoading) {
          setLoadingState(state);
        }
      });
    } else if (!isLoading) {
      // When loading stops, immediately clean up
      if (loadingManagerRef.current) {
        loadingManagerRef.current.stop();
        loadingManagerRef.current = null;
      }
      setLoadingState(null);
    }

    return () => {
      if (loadingManagerRef.current) {
        loadingManagerRef.current.stop();
        loadingManagerRef.current = null;
      }
    };
  }, [isLoading, loadingConfig]);

  // Calculate progress more conservatively - never reach 100% until actually done
  const progress = isLoading && loadingState ? Math.min(loadingState.progress * 0.9, 90) : 0;
  const currentMessage = loadingState?.currentMessage || '';

  const baseClassName = `relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-light-50 shadow-sm focus-visible:outline-none bg-light-1000 dark:bg-dark-1000 dark:text-dark-50 disabled:opacity-60 w-[220px] h-[40px] transition-all duration-300 ${isLoading ? 'shadow-lg' : 'hover:shadow-md'}`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClassName} ${className}`}
    >
      {/* Progress Bar Background */}
      {isLoading && (
        <>
          {/* Background overlay */}
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
          {/* Simple progress fill */}
          <div 
            className="absolute inset-0 bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out"
            style={{ 
              width: `${progress}%`,
              transformOrigin: 'left'
            }}
          />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full">
        {isLoading ? (
          <div className="flex items-center justify-center overflow-hidden">
            <span 
              key={`${currentMessage}-${loadingState?.currentStage}`}
              className="animate-slide-down text-white font-medium text-sm whitespace-nowrap"
            >
              {currentMessage}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </div>
        )}
      </div>
    </button>
  );
};

export default ProgressButton;
