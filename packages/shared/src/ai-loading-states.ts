/**
 * AI Loading States for Kanban Generation
 * 
 * This module provides progressive loading states and time estimates
 * for AI-powered Kanban board generation to improve user experience.
 */

export interface LoadingStage {
  message: string;
  duration: number; // Expected duration in milliseconds
  icon?: string;
}

export interface LoadingConfig {
  stages: LoadingStage[];
  totalEstimatedTime: number;
  progressUpdateInterval: number;
}

// Default loading configuration based on performance analysis
export const defaultLoadingConfig: LoadingConfig = {
  stages: [
    {
      message: "Analyzing project...",
      duration: 2800,
      icon: "🔍"
    },
    {
      message: "Generating tasks...",
      duration: 2800,
      icon: "🏗️"
    },
    {
      message: "Creating board...",
      duration: 2800,
      icon: "✍️"
    },
    {
      message: "Optimizing layout...",
      duration: 2800,
      icon: "🎯"
    },
    {
      message: "Almost done...",
      duration: 2800,
      icon: "✅"
    }
  ],
  totalEstimatedTime: 14000, // 14 seconds based on performance tests
  progressUpdateInterval: 500 // Update every 500ms
};

// Fast loading configuration for cached responses
export const cachedLoadingConfig: LoadingConfig = {
  stages: [
    { 
      message: "Loading cached board...", 
      duration: 50,
      icon: "⚡"
    }
  ],
  totalEstimatedTime: 50,
  progressUpdateInterval: 50
};

export interface LoadingState {
  currentStage: number;
  currentMessage: string;
  currentIcon?: string;
  progress: number; // 0-100
  timeElapsed: number;
  timeRemaining: number;
  isComplete: boolean;
}

export class AILoadingManager {
  private config: LoadingConfig;
  private startTime: number;
  private currentStageIndex: number = 0;
  private stageStartTime: number;
  private onUpdate?: (state: LoadingState) => void;
  private intervalId?: NodeJS.Timeout;

  constructor(config: LoadingConfig = defaultLoadingConfig) {
    this.config = config;
    this.startTime = Date.now();
    this.stageStartTime = this.startTime;
  }

  start(onUpdate?: (state: LoadingState) => void): void {
    this.onUpdate = onUpdate;
    this.currentStageIndex = 0;
    this.stageStartTime = Date.now();
    
    // Start progress updates
    this.intervalId = setInterval(() => {
      this.updateProgress();
    }, this.config.progressUpdateInterval);
    
    // Initial update
    this.updateProgress();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    
    // Send final completion state
    if (this.onUpdate) {
      this.onUpdate({
        currentStage: this.config.stages.length,
        currentMessage: "Board created successfully!",
        currentIcon: "🎉",
        progress: 100,
        timeElapsed: Date.now() - this.startTime,
        timeRemaining: 0,
        isComplete: true
      });
    }
  }

  private updateProgress(): void {
    const now = Date.now();
    const totalElapsed = now - this.startTime;

    // Check if we should advance to the next stage
    const currentStage = this.config.stages[this.currentStageIndex];
    if (!currentStage) {
      // Handle case where stages array is empty or index is out of bounds
      this.stop();
      return;
    }

    const stageElapsed = now - this.stageStartTime;

    if (stageElapsed >= currentStage.duration && this.currentStageIndex < this.config.stages.length - 1) {
      this.currentStageIndex++;
      this.stageStartTime = now;
    }

    // Calculate overall progress
    let progressTime = 0;
    for (let i = 0; i < this.currentStageIndex; i++) {
      const stage = this.config.stages[i];
      if (stage) {
        progressTime += stage.duration;
      }
    }

    // Add progress within current stage
    if (this.currentStageIndex < this.config.stages.length && currentStage) {
      const currentStageProgress = Math.min(stageElapsed, currentStage.duration);
      progressTime += currentStageProgress;
    }

    const progress = Math.min((progressTime / this.config.totalEstimatedTime) * 100, 100);
    const timeRemaining = Math.max(this.config.totalEstimatedTime - totalElapsed, 0);

    const state: LoadingState = {
      currentStage: this.currentStageIndex + 1,
      currentMessage: currentStage.message,
      currentIcon: currentStage.icon,
      progress,
      timeElapsed: totalElapsed,
      timeRemaining,
      isComplete: progress >= 100
    };

    if (this.onUpdate) {
      this.onUpdate(state);
    }

    // Auto-stop when complete
    if (state.isComplete) {
      this.stop();
    }
  }

  // Static method for quick usage
  static createProgressTracker(
    isCached: boolean = false,
    onUpdate?: (state: LoadingState) => void
  ): AILoadingManager {
    const config = isCached ? cachedLoadingConfig : defaultLoadingConfig;
    const manager = new AILoadingManager(config);
    manager.start(onUpdate);
    return manager;
  }
}

// Utility functions for React components
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds < 1000) {
    return "Less than a second";
  }
  
  const seconds = Math.ceil(milliseconds / 1000);
  
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getProgressColor(progress: number): string {
  if (progress < 25) return "#ef4444"; // red-500
  if (progress < 50) return "#f97316"; // orange-500
  if (progress < 75) return "#eab308"; // yellow-500
  return "#22c55e"; // green-500
}

// Types are already exported at their declarations above
