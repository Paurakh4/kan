import { useRouter } from "next/router";
import { t } from "@lingui/core/macro";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiPlus, HiTrash, HiSparkles } from "react-icons/hi2";
import { z } from "zod";

import Button from "~/components/Button";
import Input from "~/components/Input";
import { useModal } from "~/providers/modal";
import { usePopup } from "~/providers/popup";
import { useWorkspace } from "~/providers/workspace";
import { api } from "~/utils/api";

// Form validation schema - defined inside component to access t function
const createGeneratePlanSchema = () => z.object({
  boardName: z.string().min(1, "Board name is required").max(255, "Board name is too long"),
  projectIdea: z.string().min(10, "Project idea must be at least 10 characters").max(2000, "Project idea is too long"),
  features: z.array(z.string().min(1, "Feature cannot be empty").max(500, "Feature is too long")).min(1, "At least one feature is required").max(20, "Maximum 20 features allowed"),
});

type GeneratePlanFormData = z.infer<ReturnType<typeof createGeneratePlanSchema>>;

export default function GeneratePlanModal() {
  const router = useRouter();
  const { closeModal } = useModal();
  const { showPopup } = usePopup();
  const { workspace, isLoading: workspaceLoading, hasLoaded } = useWorkspace();
  const [features, setFeatures] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
          <HiSparkles className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
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
            className="w-full min-h-[60px] px-2 py-1 border border-light-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-dark-400 dark:bg-dark-200 dark:text-dark-1000 placeholder:text-xs"
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
          <Button
            type="submit"
            isLoading={generatePlan.isPending}
            disabled={generatePlan.isPending || !isWorkspaceReady}
          >
            <HiSparkles className="h-4 w-4 mr-2" />
            {generatePlan.isPending ? t`Generating...` : !hasLoaded ? t`Loading workspace...` : t`Generate Plan`}
          </Button>
        </div>
      </form>
    </div>
  );
}
