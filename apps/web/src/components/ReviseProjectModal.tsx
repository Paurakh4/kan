import { useState } from "react";
import { useRouter } from "next/router";
import { t } from "@lingui/core/macro";
import { HiXMark } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "~/components/Button";
import { useModal } from "~/providers/modal";
import { usePopup } from "~/providers/popup";
import { api } from "~/utils/api";
import { useTheme } from "~/providers/theme";

const AiIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const { activeTheme } = useTheme();
  const isDark = activeTheme === "dark";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      {isDark ? (
        // Use solid color in dark mode (original color)
        <g>
          <path fill="#a78bfa" d="M12.136,4.763l1.574,3.591c0.379,0.865,1.07,1.556,1.936,1.936l3.591,1.574 c0.99,0.434,0.99,1.838,0,2.271l-3.591,1.574c-0.865,0.379-1.556,1.07-1.936,1.936l-1.574,3.591c-0.434,0.99-1.838,0.99-2.271,0 L8.29,17.646c-0.379-0.865-1.07-1.556-1.936-1.936l-3.591-1.574c-0.99-0.434-0.99-1.838,0-2.271l3.591-1.574 C7.219,9.91,7.91,9.219,8.29,8.354l1.574-3.591C10.298,3.773,11.702,3.773,12.136,4.763z" />
          <path fill="#a78bfa" d="M11,4.521 c0.303,0,0.556,0.166,0.678,0.443l1.574,3.591c0.431,0.983,1.21,1.762,2.193,2.193l3.591,1.574 c0.277,0.122,0.443,0.375,0.443,0.678s-0.166,0.556-0.443,0.678l-3.591,1.574c-0.983,0.431-1.762,1.21-2.193,2.193l-1.574,3.591 c-0.122,0.277-0.375,0.443-0.678,0.443s-0.556-0.166-0.678-0.443l-1.574-3.591c-0.431-0.983-1.21-1.762-2.193-2.193l-3.591-1.574 C2.686,13.556,2.521,13.303,2.521,13s0.166-0.556,0.443-0.678l3.591-1.574c0.983-0.431,1.762-1.21,2.193-2.193l1.574-3.591 C10.444,4.686,10.697,4.521,11,4.521z" />
          <circle fill="#a78bfa" cx="19" cy="5" r="2" />
        </g>
      ) : (
        // Use gradient in light mode
        <g>
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
          <path fill="url(#aiicon-light-1)" d="M12.136,4.763l1.574,3.591c0.379,0.865,1.07,1.556,1.936,1.936l3.591,1.574 c0.99,0.434,0.99,1.838,0,2.271l-3.591,1.574c-0.865,0.379-1.556,1.07-1.936,1.936l-1.574,3.591c-0.434,0.99-1.838,0.99-2.271,0 L8.29,17.646c-0.379-0.865-1.07-1.556-1.936-1.936l-3.591-1.574c-0.99-0.434-0.99-1.838,0-2.271l3.591-1.574 C7.219,9.91,7.91,9.219,8.29,8.354l1.574-3.591C10.298,3.773,11.702,3.773,12.136,4.763z" />
          <path fill="url(#aiicon-light-2)" d="M11,4.521 c0.303,0,0.556,0.166,0.678,0.443l1.574,3.591c0.431,0.983,1.21,1.762,2.193,2.193l3.591,1.574 c0.277,0.122,0.443,0.375,0.443,0.678s-0.166,0.556-0.443,0.678l-3.591,1.574c-0.983,0.431-1.762,1.21-2.193,2.193l-1.574,3.591 c-0.122,0.277-0.375,0.443-0.678,0.443s-0.556-0.166-0.678-0.443l-1.574-3.591c-0.431-0.983-1.21-1.762-2.193-2.193l-3.591-1.574 C2.686,13.556,2.521,13.303,2.521,13s0.166-0.556,0.443-0.678l3.591-1.574c0.983-0.431,1.762-1.21,2.193-2.193l1.574-3.591 C10.444,4.686,10.697,4.521,11,4.521z" />
          <circle fill="url(#aiicon-light-3)" cx="19" cy="5" r="2" />
        </g>
      )}
    </svg>
  );
};

// Form validation schema
const reviseProjectSchema = z.object({
  revisionNotes: z.string().min(10, "Please provide at least 10 characters describing what you'd like to change").max(1000, "Revision notes are too long (max 1000 characters)"),
});

type ReviseProjectFormData = z.infer<typeof reviseProjectSchema>;

interface ReviseProjectModalProps {
  boardPublicId: string;
}

export default function ReviseProjectModal({ boardPublicId }: ReviseProjectModalProps) {
  const router = useRouter();
  const { closeModal } = useModal();
  const { showPopup } = usePopup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReviseProjectFormData>({
    resolver: zodResolver(reviseProjectSchema),
    defaultValues: {
      revisionNotes: "",
    },
  });

  const revisionNotes = watch("revisionNotes");

  const reviseProject = api.ai.reviseProject.useMutation({
    onSuccess: () => {
      closeModal();
      showPopup({
        header: t`Project Revised Successfully!`,
        message: t`Your Kanban board has been regenerated with your requested changes.`,
        icon: "success",
      });
      // Refresh the current page to show the updated board
      router.reload();
    },
    onError: (error) => {
      showPopup({
        header: t`Failed to Revise Project`,
        message: error.message || t`Please try again later, or contact customer support.`,
        icon: "error",
      });
    },
  });

  const onSubmit = (data: ReviseProjectFormData) => {
    reviseProject.mutate({
      boardPublicId,
      revisionNotes: data.revisionNotes,
    });
  };

  return (
    <div className="p-5">
      <div className="flex w-full items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <AiIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-1000">
            {t`Revise Project`}
          </h2>
        </div>
        <button
          onClick={closeModal}
          className="rounded-md p-1 hover:bg-light-200 dark:hover:bg-dark-200"
          disabled={reviseProject.isPending}
        >
          <HiXMark className="h-5 w-5 text-dark-900" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-neutral-600 dark:text-dark-700">
          {t`Describe what you'd like to change or improve in your project board. The AI will regenerate your Kanban board based on your feedback while maintaining the original project context.`}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="revisionNotes"
            className="block text-sm font-medium text-neutral-900 dark:text-dark-1000 mb-2"
          >
            {t`Revision Preferences`}
          </label>
          <textarea
            {...register("revisionNotes")}
            id="revisionNotes"
            rows={4}
            className="w-full rounded-md border border-light-600 bg-light-50 px-3 py-2 text-sm text-neutral-900 placeholder-light-900 focus:border-light-1000 focus:outline-none focus:ring-1 focus:ring-light-1000 dark:border-dark-600 dark:bg-dark-300 dark:text-dark-1000 dark:placeholder-dark-700 dark:focus:border-dark-1000 dark:focus:ring-dark-1000"
            placeholder={t`Describe what you'd like to change or improve in your project board...

Examples:
• Add more detailed technical tasks
• Focus more on testing and quality assurance
• Include deployment and DevOps tasks
• Break down features into smaller, more manageable tasks
• Add more frontend-focused work items`}
            disabled={reviseProject.isPending}
          />
          {errors.revisionNotes && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.revisionNotes.message}
            </p>
          )}
          <div className="mt-1 text-xs text-light-900 dark:text-dark-700">
            {revisionNotes.length}/1000 characters
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-light-200 dark:border-dark-400">
          <Button
            type="button"
            variant="secondary"
            onClick={closeModal}
            disabled={reviseProject.isPending}
          >
            {t`Cancel`}
          </Button>
          <Button
            type="submit"
            isLoading={reviseProject.isPending}
            disabled={reviseProject.isPending}
            iconLeft={<AiIcon className="h-4 w-4" />}
          >
            {reviseProject.isPending ? t`Regenerating...` : t`Regenerate Board`}
          </Button>
        </div>
      </form>
    </div>
  );
}
