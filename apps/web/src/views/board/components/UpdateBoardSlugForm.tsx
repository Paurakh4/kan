import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiXMark } from "react-icons/hi2";
import { z } from "zod";

import Button from "~/components/Button";
import Input from "~/components/Input";
import { useModal } from "~/providers/modal";
import { usePopup } from "~/providers/popup";
import { api } from "~/utils/api";

const schema = z.object({
  slug: z
    .string()
    .min(3, {
      message: "Board URL must be at least 3 characters long",
    })
    .max(60, { message: "Board URL cannot exceed 60 characters" })
    .regex(/^(?![-]+$)[a-zA-Z0-9-]+$/, {
      message: "Board URL can only contain letters, numbers, and hyphens",
    }),
});

type FormValues = z.infer<typeof schema>;

interface QueryParams {
  boardPublicId: string;
  members: string[];
  labels: string[];
}

export function UpdateBoardSlugForm({
  boardPublicId,
  workspaceSlug,
  boardSlug,
  queryParams,
}: {
  boardPublicId: string;
  workspaceSlug: string;
  boardSlug: string;
  queryParams: QueryParams;
}) {
  const { closeModal } = useModal();
  const { showPopup } = usePopup();
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      slug: boardSlug,
    },
    mode: "onChange",
  });

  const updateBoardSlug = api.board.update.useMutation({
    onError: () => {
      showPopup({
        header: "Unable to update board URL",
        message: "Please try again later, or contact customer support.",
        icon: "error",
      });
    },
    onSettled: async () => {
      closeModal();
      await utils.board.byId.invalidate(queryParams);
    },
  });

  useEffect(() => {
    const nameElement: HTMLElement | null =
      document.querySelector<HTMLElement>("#board-slug");
    if (nameElement) nameElement.focus();
  }, []);

  const onSubmit = (data: FormValues) => {
    updateBoardSlug.mutate({
      slug: data.slug,
      boardPublicId,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-5 pt-5">
        <div className="flex w-full items-center justify-between pb-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-dark-1000">
            Edit board URL
          </h2>
          <button
            type="button"
            className="rounded p-1 hover:bg-light-200 focus:outline-none dark:hover:bg-dark-300"
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
          >
            <HiXMark size={18} className="text-light-900 dark:text-dark-900" />
          </button>
        </div>

        <Input
          id="board-slug"
          {...register("slug")}
          errorMessage={errors.slug?.message}
          prefix={`kan.bn/${workspaceSlug}/`}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              await handleSubmit(onSubmit)();
            }
          }}
        />
      </div>
      <div className="mt-12 flex items-center justify-end border-t border-light-600 px-5 pb-5 pt-5 dark:border-dark-600">
        <div>
          <Button
            type="submit"
            isLoading={updateBoardSlug.isPending}
            disabled={
              !isDirty ||
              updateBoardSlug.isPending ||
              errors.slug?.message !== undefined
            }
          >
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}
