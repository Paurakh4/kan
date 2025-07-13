import { useState } from "react";
import { useRouter } from "next/router";
import { t } from "@lingui/core/macro";
import { HiXMark, HiSparkles } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "~/components/Button";
import { useModal } from "~/providers/modal";
import { usePopup } from "~/providers/popup";
import { api } from "~/utils/api";

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
          <HiSparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
            iconLeft={<HiSparkles className="h-4 w-4" />}
          >
            {reviseProject.isPending ? t`Regenerating...` : t`Regenerate Board`}
          </Button>
        </div>
      </form>
    </div>
  );
}
