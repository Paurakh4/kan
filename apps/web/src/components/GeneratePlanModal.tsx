import { useRouter } from "next/router";
import { t } from "@lingui/core/macro";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { z } from "zod";

import Button from "~/components/Button";
import Input from "~/components/Input";
import { useModal } from "~/providers/modal";
import { usePopup } from "~/providers/popup";
import { useWorkspace } from "~/providers/workspace";
import { useTheme } from "~/providers/theme";
import { api } from "~/utils/api";
import { AILoadingManager, LoadingState, defaultLoadingConfig } from "@kan/shared";

// Form validation schema - defined inside component to access t function
const createGeneratePlanSchema = () => z.object({
  boardName: z.string().min(1, "Board name is required").max(255, "Board name is too long"),
  projectIdea: z.string().min(10, "Project idea must be at least 10 characters").max(2000, "Project idea is too long"),
  features: z.array(z.string().min(1, "Feature cannot be empty").max(500, "Feature is too long")).min(1, "At least one feature is required").max(20, "Maximum 20 features allowed"),
});

type GeneratePlanFormData = z.infer<ReturnType<typeof createGeneratePlanSchema>>;

const AiIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const { activeTheme } = useTheme();
  const isDark = activeTheme === "dark";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      {isDark ? (
        <>
          <linearGradient id="aiicon-dark-1" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-dark-2" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset=".493" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset=".997" stopColor="#7c3aed" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-dark-3" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-dark-4" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset=".493" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset=".997" stopColor="#7c3aed" stopOpacity="1" />
          </linearGradient>
        </>
      ) : (
        <>
          <linearGradient id="aiicon-light-1" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset="1" stopColor="#444" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-light-2" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset=".493" stopColor="#888" stopOpacity="0" />
            <stop offset=".997" stopColor="#444" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-light-3" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset="1" stopColor="#444" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-light-4" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset=".493" stopColor="#888" stopOpacity="0" />
            <stop offset=".997" stopColor="#444" stopOpacity="1" />
          </linearGradient>
        </>
      )}
      <path fill={`url(#${isDark ? 'aiicon-dark-1' : 'aiicon-light-1'})`} d="M12.136,4.763l1.574,3.591c0.379,0.865,1.07,1.556,1.936,1.936l3.591,1.574 c0.99,0.434,0.99,1.838,0,2.271l-3.591,1.574c-0.865,0.379-1.556,1.07-1.936,1.936l-1.574,3.591c-0.434,0.99-1.838,0.99-2.271,0 L8.29,17.646c-0.379-0.865-1.07-1.556-1.936-1.936l-3.591-1.574c-0.99-0.434-0.99-1.838,0-2.271l3.591-1.574 C7.219,9.91,7.91,9.219,8.29,8.354l1.574-3.591C10.298,3.773,11.702,3.773,12.136,4.763z" />
      <path fill={`url(#${isDark ? 'aiicon-dark-2' : 'aiicon-light-2'})`} d="M11,4.521 c0.303,0,0.556,0.166,0.678,0.443l1.574,3.591c0.431,0.983,1.21,1.762,2.193,2.193l3.591,1.574 c0.277,0.122,0.443,0.375,0.443,0.678s-0.166,0.556-0.443,0.678l-3.591,1.574c-0.983,0.431-1.762,1.21-2.193,2.193l-1.574,3.591 c-0.122,0.277-0.375,0.443-0.678,0.443s-0.556-0.166-0.678-0.443l-1.574-3.591c-0.431-0.983-1.21-1.762-2.193-2.193l-3.591-1.574 C2.686,13.556,2.521,13.303,2.521,13s0.166-0.556,0.443-0.678l3.591-1.574c0.983-0.431,1.762-1.21,2.193-2.193l1.574-3.591 C10.444,4.686,10.697,4.521,11,4.521 M11,4.021c-0.459,0-0.919,0.247-1.136,0.742L8.29,8.354C7.91,9.219,7.219,9.91,6.354,10.29 l-3.591,1.574c-0.99,0.434-0.99,1.838,0,2.271l3.591,1.574c0.865,0.379,1.556,1.07,1.936,1.936l1.574,3.591 c0.217,0.495,0.676,0.742,1.136,0.742s0.919-0.247,1.136-0.742l1.574-3.591c0.379-0.865,1.07-1.556,1.936-1.936l3.591-1.574 c0.99-0.434,0.99-1.838,0-2.271l-3.591-1.574c-0.865-0.379-1.556-1.07-1.936-1.936l-1.574-3.591 C11.919,4.268,11.459,4.021,11,4.021L11,4.021z" />
      <g>
        <path fill={`url(#${isDark ? 'aiicon-dark-3' : 'aiicon-light-3'})`} d="M19.523,2.37l0.261,0.699 c0.198,0.531,0.617,0.95,1.148,1.148l0.699,0.261c0.484,0.181,0.484,0.865,0,1.045l-0.699,0.261 C20.4,5.981,19.981,6.4,19.783,6.931L19.523,7.63c-0.181,0.484-0.865,0.484-1.045,0l-0.261-0.699 C18.019,6.4,17.6,5.981,17.069,5.783L16.37,5.523c-0.484-0.181-0.484-0.865,0-1.045l0.699-0.261 c0.531-0.198,0.95-0.617,1.148-1.148l0.261-0.699C18.658,1.886,19.342,1.886,19.523,2.37z" />
        <path fill={`url(#${isDark ? 'aiicon-dark-4' : 'aiicon-light-4'})`} d="M19,2.507c0.04,0,0.049,0.024,0.054,0.038 l0.261,0.699c0.249,0.667,0.774,1.193,1.442,1.442l0.699,0.261C21.469,4.951,21.493,4.96,21.493,5s-0.024,0.049-0.038,0.054 l-0.699,0.261c-0.667,0.249-1.193,0.774-1.442,1.442l-0.261,0.699C19.049,7.469,19.04,7.493,19,7.493s-0.049-0.024-0.054-0.038 l-0.261-0.699c-0.249-0.667-0.774-1.193-1.442-1.442l-0.699-0.261C16.531,5.049,16.507,5.04,16.507,5s0.024-0.049,0.038-0.054 l0.699-0.261c0.667-0.249,1.193-0.774,1.442-1.442l0.261-0.699C18.951,2.531,18.96,2.507,19,2.507 M19,2.007 c-0.216,0-0.432,0.121-0.523,0.363l-0.261,0.699C18.019,3.6,17.6,4.019,17.069,4.217L16.37,4.477c-0.484,0.181-0.484,0.865,0,1.045 l0.699,0.261c0.531,0.198,0.95,0.617,1.148,1.148l0.261,0.699c0.09,0.242,0.306,0.363,0.523,0.363s0.432-0.121,0.523-0.363 l0.261-0.699c0.198-0.531,0.617-0.95,1.148-1.148l0.699-0.261c0.484-0.181,0.484-0.865,0-1.045l-0.699-0.261 C20.4,4.019,19.981,3.6,19.783,3.069L19.523,2.37C19.432,2.128,19.216,2.007,19,2.007L19,2.007z" />
      </g>
    </svg>
  );
};

// Enhanced Progress Button Component
interface ProgressButtonProps {
  isLoading: boolean;
  disabled: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const ProgressButton: React.FC<ProgressButtonProps> = ({
  isLoading,
  disabled,
  children,
  icon,
  type = "button"
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null);
  const loadingManagerRef = useRef<AILoadingManager | null>(null);

  useEffect(() => {
    if (isLoading && !loadingManagerRef.current) {
      // Start the loading animation only when actually loading
      loadingManagerRef.current = new AILoadingManager(defaultLoadingConfig);
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
  }, [isLoading]);

  // Calculate progress more conservatively - never reach 100% until actually done
  const progress = isLoading && loadingState ? Math.min(loadingState.progress * 0.9, 90) : 0;
  const currentMessage = loadingState?.currentMessage || '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-light-50 shadow-sm focus-visible:outline-none bg-light-1000 dark:bg-dark-1000 dark:text-dark-50 disabled:opacity-60 w-[180px] h-[40px] transition-all duration-300 ${isLoading ? 'shadow-lg' : 'hover:shadow-md'}`}
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

export default function GeneratePlanModal() {
  const router = useRouter();
  const { closeModal } = useModal();
  const { showPopup } = usePopup();
  const { workspace, hasLoaded } = useWorkspace();
  const [features, setFeatures] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GeneratePlanFormData>({
    resolver: zodResolver(createGeneratePlanSchema()),
    defaultValues: {
      boardName: "",
      projectIdea: "",
      features: [""],
    },
  });

  // Check if workspace is properly loaded
  const isWorkspaceReady = hasLoaded && workspace.publicId && workspace.publicId.length === 12;

  const generatePlan = api.ai.generatePlan.useMutation({
    onSuccess: (data) => {
      closeModal();
      showPopup({
        header: t`Plan Generated Successfully!`,
        message: t`Your AI-powered Kanban board has been created.`,
        icon: "success",
      });
      // Navigate to the new board using the authenticated board URL pattern
      router.push(`/boards/${data.boardPublicId}`);
    },
    onError: (error) => {
      showPopup({
        header: t`Failed to Generate Plan`,
        message: error.message || t`Please try again later, or contact customer support.`,
        icon: "error",
      });
    },
  });

  const addFeature = () => {
    if (features.length < 20) {
      const newFeatures = [...features, ""];
      setFeatures(newFeatures);
      setValue("features", newFeatures);
    }
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
      setValue("features", newFeatures);
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    setValue("features", newFeatures);
  };

  const onSubmit = (data: GeneratePlanFormData) => {
    // Validate workspace is loaded and has valid publicId
    if (!workspace.publicId || workspace.publicId.length !== 12) {
      showPopup({
        header: t`Workspace Not Ready`,
        message: t`Please wait for the workspace to load completely before generating a plan.`,
        icon: "error",
      });
      return;
    }

    // Filter out empty features
    const validFeatures = data.features.filter(feature => feature.trim().length > 0);

    if (validFeatures.length === 0) {
      showPopup({
        header: t`Invalid Input`,
        message: t`Please add at least one feature.`,
        icon: "error",
      });
      return;
    }

    generatePlan.mutate({
      boardName: data.boardName,
      projectIdea: data.projectIdea,
      features: validFeatures,
      workspacePublicId: workspace.publicId,
    });
  };

  return (
    <div className="p-4">
      <div className="mb-3">
        <div className="flex items-center mb-2">
          <AiIcon className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-dark-1000">
            {t`Generate AI-Powered Kanban Plan`}
          </h2>
        </div>
        <p className="text-sm text-neutral-600 dark:text-dark-700">
          {t`Describe your project and features, and AI will create a structured Kanban board for you.`}
        </p>
        {!isWorkspaceReady && (
          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {!hasLoaded ? t`Loading workspace...` : t`Workspace not available. Please ensure you have access to a workspace.`}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Board Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-dark-1000 mb-2">
            {t`Board Name`}
          </label>
          <Input
            {...register("boardName")}
            placeholder={t`e.g., Mobile App Development`}
            errorMessage={errors.boardName?.message}
            className="placeholder:text-xs"
          />
        </div>

        {/* Project Idea */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-dark-1000 mb-2">
            {t`Project Idea`}
          </label>
          <textarea
            {...register("projectIdea")}
            placeholder={t`Project details and main goals`}
            className="block w-full rounded-md border-0 bg-dark-300 bg-white/5 py-1.5 text-sm shadow-sm ring-1 ring-inset ring-light-600 placeholder:text-dark-800 focus:ring-2 focus:ring-inset focus:ring-light-700 dark:text-dark-1000 dark:ring-dark-700 dark:focus:ring-dark-700 sm:leading-6 min-h-[60px] px-3 placeholder:text-xs"
            rows={2}
          />
          {errors.projectIdea && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.projectIdea.message}
            </p>
          )}
        </div>

        {/* Features */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-neutral-900 dark:text-dark-1000">
              {t`Features`} ({features.length}/20)
            </label>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={addFeature}
              disabled={features.length >= 20}
              className="px-2 py-1 text-xs h-7"
            >
              <HiPlus className="h-3 w-3 mr-1" />
              {t`Add`}
            </Button>
          </div>
          <div className="space-y-1">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={t`e.g., User authentication, Push notifications`}
                  className="flex-1 placeholder:text-xs"
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => removeFeature(index)}
                  >
                    <HiTrash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {errors.features && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.features.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-light-200 dark:border-dark-400">
          <Button
            type="button"
            variant="secondary"
            onClick={closeModal}
            disabled={generatePlan.isPending}
          >
            {t`Cancel`}
          </Button>
          <ProgressButton
            type="submit"
            isLoading={generatePlan.isPending}
            disabled={generatePlan.isPending || !isWorkspaceReady}
            icon={<AiIcon className="h-4 w-4" />}
          >
            {!hasLoaded ? t`Loading workspace...` : t`Generate Plan`}
          </ProgressButton>
        </div>
      </form>
    </div>
  );
}
