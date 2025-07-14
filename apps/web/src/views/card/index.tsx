import Link from "next/link";
import { useRouter } from "next/router";
import { t } from "@lingui/core/macro";
import { useForm } from "react-hook-form";
import { IoChevronForwardSharp } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";

import { AIPromptModal } from "~/components/AIPromptModal";
import Avatar from "~/components/Avatar";
import Editor from "~/components/Editor";
import { LabelForm } from "~/components/LabelForm";
import LabelIcon from "~/components/LabelIcon";
import Modal, { ModalSizeProvider } from "~/components/modal";
import { NewWorkspaceForm } from "~/components/NewWorkspaceForm";
import { PageHead } from "~/components/PageHead";
import { useModal } from "~/providers/modal";
import { usePopup } from "~/providers/popup";
import { useWorkspace } from "~/providers/workspace";
import { api } from "~/utils/api";
import { formatMemberDisplayName, getAvatarUrl } from "~/utils/helpers";
import { DeleteLabelConfirmation } from "../../components/DeleteLabelConfirmation";
import ActivityList from "./components/ActivityList";
import { DeleteCardConfirmation } from "./components/DeleteCardConfirmation";
import { DeleteCommentConfirmation } from "./components/DeleteCommentConfirmation";
import Dropdown from "./components/Dropdown";
import LabelSelector from "./components/LabelSelector";
import ListSelector from "./components/ListSelector";
import MemberSelector from "./components/MemberSelector";
import NewCommentForm from "./components/NewCommentForm";

interface FormValues {
  cardId: string;
  title: string;
  description: string;
}

export function CardRightPanel() {
  const router = useRouter();
  const cardId = Array.isArray(router.query.cardId)
    ? router.query.cardId[0]
    : router.query.cardId;

  const { data: card } = api.card.byId.useQuery({
    cardPublicId: cardId ?? "",
  });

  const board = card?.list.board;
  const labels = board?.labels;
  const workspaceMembers = board?.workspace.members;
  const selectedLabels = card?.labels;
  const selectedMembers = card?.members;

  const formattedLabels =
    labels?.map((label) => {
      const isSelected = selectedLabels?.some(
        (selectedLabel) => selectedLabel.publicId === label.publicId,
      );

      return {
        key: label.publicId,
        value: label.name,
        selected: isSelected ?? false,
        leftIcon: <LabelIcon colourCode={label.colourCode} />,
      };
    }) ?? [];

  const formattedLists =
    board?.lists.map((list) => ({
      key: list.publicId,
      value: list.name,
      selected: list.publicId === card?.list.publicId,
    })) ?? [];

  const formattedMembers =
    workspaceMembers?.map((member) => {
      const isSelected = selectedMembers?.some(
        (assignedMember) => assignedMember.publicId === member.publicId,
      );

      return {
        key: member.publicId,
        value: formatMemberDisplayName(
          member.user?.name ?? null,
          member.user?.email ?? member.email,
        ),
        imageUrl: member.user?.image
          ? getAvatarUrl(member.user.image)
          : undefined,
        selected: isSelected ?? false,
        leftIcon: (
          <Avatar
            size="xs"
            name={member.user?.name ?? ""}
            imageUrl={
              member.user?.image ? getAvatarUrl(member.user.image) : undefined
            }
            email={member.user?.email ?? member.email}
          />
        ),
      };
    }) ?? [];

  return (
    <div className="h-full w-[360px] border-l-[1px] border-light-600 bg-light-200 p-8 text-light-900 dark:border-dark-400 dark:bg-dark-100 dark:text-dark-900">
      <div className="mb-4 flex w-full flex-row">
        <p className="my-2 mb-2 w-[100px] text-sm font-medium">{t`List`}</p>
        <ListSelector
          cardPublicId={cardId ?? ""}
          lists={formattedLists}
          isLoading={!card}
        />
      </div>
      <div className="mb-4 flex w-full flex-row">
        <p className="my-2 mb-2 w-[100px] text-sm font-medium">{t`Labels`}</p>
        <LabelSelector
          cardPublicId={cardId ?? ""}
          labels={formattedLabels}
          isLoading={!card}
        />
      </div>
      <div className="flex w-full flex-row">
        <p className="my-2 mb-2 w-[100px] text-sm font-medium">{t`Members`}</p>
        <MemberSelector
          cardPublicId={cardId ?? ""}
          members={formattedMembers}
          isLoading={!card}
        />
      </div>
    </div>
  );
}

const AiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <linearGradient id="YRuAUo7vAs9nWyaLFYB5va_BM6i7Qnf1bdk_gr1" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".6"></stop><stop offset="1" stopColor="#fff" stopOpacity=".3"></stop></linearGradient>
    <path fill="url(#YRuAUo7vAs9nWyaLFYB5va_BM6i7Qnf1bdk_gr1)" d="M12.136,4.763l1.574,3.591c0.379,0.865,1.07,1.556,1.936,1.936l3.591,1.574 c0.99,0.434,0.99,1.838,0,2.271l-3.591,1.574c-0.865,0.379-1.556,1.07-1.936,1.936l-1.574,3.591c-0.434,0.99-1.838,0.99-2.271,0 L8.29,17.646c-0.379-0.865-1.07-1.556-1.936-1.936l-3.591-1.574c-0.99-0.434-0.99-1.838,0-2.271l3.591-1.574 C7.219,9.91,7.91,9.219,8.29,8.354l1.574-3.591C10.298,3.773,11.702,3.773,12.136,4.763z"></path>
    <linearGradient id="YRuAUo7vAs9nWyaLFYB5vb_BM6i7Qnf1bdk_gr2" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".6"></stop><stop offset=".493" stopColor="#fff" stopOpacity="0"></stop><stop offset=".997" stopColor="#fff" stopOpacity=".3"></stop></linearGradient>
    <path fill="url(#YRuAUo7vAs9nWyaLFYB5vb_BM6i7Qnf1bdk_gr2)" d="M11,4.521 c0.303,0,0.556,0.166,0.678,0.443l1.574,3.591c0.431,0.983,1.21,1.762,2.193,2.193l3.591,1.574 c0.277,0.122,0.443,0.375,0.443,0.678s-0.166,0.556-0.443,0.678l-3.591,1.574c-0.983,0.431-1.762,1.21-2.193,2.193l-1.574,3.591 c-0.122,0.277-0.375,0.443-0.678,0.443s-0.556-0.166-0.678-0.443l-1.574-3.591c-0.431-0.983-1.21-1.762-2.193-2.193l-3.591-1.574 C2.686,13.556,2.521,13.303,2.521,13s0.166-0.556,0.443-0.678l3.591-1.574c0.983-0.431,1.762-1.21,2.193-2.193l1.574-3.591 C10.444,4.686,10.697,4.521,11,4.521 M11,4.021c-0.459,0-0.919,0.247-1.136,0.742L8.29,8.354C7.91,9.219,7.219,9.91,6.354,10.29 l-3.591,1.574c-0.99,0.434-0.99,1.838,0,2.271l3.591,1.574c0.865,0.379,1.556,1.07,1.936,1.936l1.574,3.591 c0.217,0.495,0.676,0.742,1.136,0.742s0.919-0.247,1.136-0.742l1.574-3.591c0.379-0.865,1.07-1.556,1.936-1.936l3.591-1.574 c0.99-0.434,0.99-1.838,0-2.271l-3.591-1.574c-0.865-0.379-1.556-1.07-1.936-1.936l-1.574-3.591 C11.919,4.268,11.459,4.021,11,4.021L11,4.021z"></path>
    <g><linearGradient id="YRuAUo7vAs9nWyaLFYB5vc_BM6i7Qnf1bdk_gr3" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".6"></stop><stop offset="1" stopColor="#fff" stopOpacity=".3"></stop></linearGradient>
    <path fill="url(#YRuAUo7vAs9nWyaLFYB5vc_BM6i7Qnf1bdk_gr3)" d="M19.523,2.37l0.261,0.699 c0.198,0.531,0.617,0.95,1.148,1.148l0.699,0.261c0.484,0.181,0.484,0.865,0,1.045l-0.699,0.261 C20.4,5.981,19.981,6.4,19.783,6.931L19.523,7.63c-0.181,0.484-0.865,0.484-1.045,0l-0.261-0.699 C18.019,6.4,17.6,5.981,17.069,5.783L16.37,5.523c-0.484-0.181-0.484-0.865,0-1.045l0.699-0.261 c0.531-0.198,0.95-0.617,1.148-1.148l0.261-0.699C18.658,1.886,19.342,1.886,19.523,2.37z"></path>
    <linearGradient id="YRuAUo7vAs9nWyaLFYB5vd_BM6i7Qnf1bdk_gr4" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".6"></stop><stop offset=".493" stopColor="#fff" stopOpacity="0"></stop><stop offset=".997" stopColor="#fff" stopOpacity=".3"></stop></linearGradient>
    <path fill="url(#YRuAUo7vAs9nWyaLFYB5vd_BM6i7Qnf1bdk_gr4)" d="M19,2.507c0.04,0,0.049,0.024,0.054,0.038 l0.261,0.699c0.249,0.667,0.774,1.193,1.442,1.442l0.699,0.261C21.469,4.951,21.493,4.96,21.493,5s-0.024,0.049-0.038,0.054 l-0.699,0.261c-0.667,0.249-1.193,0.774-1.442,1.442l-0.261,0.699C19.049,7.469,19.04,7.493,19,7.493s-0.049-0.024-0.054-0.038 l-0.261-0.699c-0.249-0.667-0.774-1.193-1.442-1.442l-0.699-0.261C16.531,5.049,16.507,5.04,16.507,5s0.024-0.049,0.038-0.054 l0.699-0.261c0.667-0.249,1.193-0.774,1.442-1.442l0.261-0.699C18.951,2.531,18.96,2.507,19,2.507 M19,2.007 c-0.216,0-0.432,0.121-0.523,0.363l-0.261,0.699C18.019,3.6,17.6,4.019,17.069,4.217L16.37,4.477c-0.484,0.181-0.484,0.865,0,1.045 l0.699,0.261c0.531,0.198,0.95,0.617,1.148,1.148l0.261,0.699c0.09,0.242,0.306,0.363,0.523,0.363s0.432-0.121,0.523-0.363 l0.261-0.699c0.198-0.531,0.617-0.95,1.148-1.148l0.699-0.261c0.484-0.181,0.484-0.865,0-1.045l-0.699-0.261 C20.4,4.019,19.981,3.6,19.783,3.069L19.523,2.37C19.432,2.128,19.216,2.007,19,2.007L19,2.007z"></path></g>
  </svg>
);

export default function CardPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const { modalContentType, entityId, openModal } = useModal();
  const { showPopup } = usePopup();
  const { workspace } = useWorkspace();

  const cardId = Array.isArray(router.query.cardId)
    ? router.query.cardId[0]
    : router.query.cardId;

  const { data: card, isLoading } = api.card.byId.useQuery({
    cardPublicId: cardId ?? "",
  });

  const refetchCard = async () => {
    if (cardId) await utils.card.byId.refetch({ cardPublicId: cardId });
  };

  const board = card?.list.board;
  const boardId = board?.publicId;
  const activities = card?.activities;

  const updateCard = api.card.update.useMutation({
    onError: () => {
      showPopup({
        header: t`Unable to update card`,
        message: t`Please try again later, or contact customer support.`,
        icon: "error",
      });
    },
    onSettled: async () => {
      await utils.card.byId.invalidate({ cardPublicId: cardId });
    },
  });

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    values: {
      cardId: cardId ?? "",
      title: card?.title ?? "",
      description: card?.description ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    updateCard.mutate({
      cardPublicId: values.cardId,
      title: values.title,
      description: values.description,
    });
  };

  if (!cardId) return <></>;

  return (
    <>
      <PageHead
        title={t`${card?.title ?? "Card"} | ${board?.name ?? "Board"}`}
      />
      <div className="flex h-full flex-1 flex-row">
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="h-full max-h-[calc(100dvh-3rem)] overflow-y-auto p-6 md:max-h-[calc(100dvh-4rem)] md:p-8">
            <div className="mb-8 flex w-full items-center justify-between">
              {!card && isLoading && (
                <div className="flex space-x-2">
                  <div className="h-[2.3rem] w-[150px] animate-pulse rounded-[5px] bg-light-300 dark:bg-dark-300" />
                  <div className="h-[2.3rem] w-[300px] animate-pulse rounded-[5px] bg-light-300 dark:bg-dark-300" />
                </div>
              )}
              {card && (
                <>
                  <Link
                    className="whitespace-nowrap font-bold leading-[2.3rem] tracking-tight text-light-900 dark:text-dark-900 sm:text-[1.2rem]"
                    href={`/boards/${board?.publicId}`}
                  >
                    {board?.name}
                  </Link>
                  <IoChevronForwardSharp
                    size={18}
                    className="mx-2 text-light-900 dark:text-dark-900"
                  />
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                  >
                    <div>
                      <input
                        type="text"
                        id="title"
                        {...register("title")}
                        onBlur={handleSubmit(onSubmit)}
                        className="block w-full border-0 bg-transparent p-0 py-0 font-bold tracking-tight text-neutral-900 focus:ring-0 dark:text-dark-1000 sm:text-[1.2rem]"
                      />
                    </div>
                  </form>
                  <div className="flex items-center gap-2">
                    <Dropdown />
                  </div>
                </>
              )}
              {!card && !isLoading && (
                <p className="block p-0 py-0 font-bold leading-[2.3rem] tracking-tight text-neutral-900 dark:text-dark-1000 sm:text-[1.2rem]">
                  {t`Card not found`}
                </p>
              )}
            </div>
            {card && (
              <>
                <div className="mb-10 flex w-full max-w-2xl flex-col justify-between">
                  {/* AI Prompt Button - Prominent Location */}
                  <div className="mb-6">
                    <button
                      onClick={() => openModal("AI_PROMPT", cardId)}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      title={t`Generate AI prompt for this task`}
                    >
                      <AiIcon className="h-5 w-5" />
                      <span>{t`Generate AI Prompt`}</span>
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                  >
                    <div className="mt-2">
                      <Editor
                        content={card.description}
                        onChange={(e) => setValue("description", e)}
                        onBlur={() => handleSubmit(onSubmit)()}
                      />
                    </div>
                  </form>
                </div>
                <div className="border-t-[1px] border-light-600 pt-12 dark:border-dark-400">
                  <h2 className="text-md pb-4 font-medium text-light-900 dark:text-dark-1000">
                    {t`Activity`}
                  </h2>
                  <div>
                    <ActivityList
                      cardPublicId={cardId}
                      activities={activities ?? []}
                      isLoading={!card}
                      isAdmin={workspace.role === "admin"}
                    />
                  </div>
                  <div className="mt-6">
                    <NewCommentForm cardPublicId={cardId} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Modal>
          {modalContentType === "NEW_LABEL" && (
            <LabelForm boardPublicId={boardId ?? ""} refetch={refetchCard} />
          )}
          {modalContentType === "EDIT_LABEL" && (
            <LabelForm
              boardPublicId={boardId ?? ""}
              refetch={refetchCard}
              isEdit
            />
          )}
          {modalContentType === "DELETE_LABEL" && (
            <DeleteLabelConfirmation
              refetch={refetchCard}
              labelPublicId={entityId}
            />
          )}
          {modalContentType === "DELETE_CARD" && (
            <DeleteCardConfirmation
              boardPublicId={boardId ?? ""}
              cardPublicId={cardId}
            />
          )}
          {modalContentType === "DELETE_COMMENT" && (
            <DeleteCommentConfirmation
              cardPublicId={cardId}
              commentPublicId={entityId}
            />
          )}
          {modalContentType === "NEW_WORKSPACE" && <NewWorkspaceForm />}
          {modalContentType === "AI_PROMPT" && (
            <ModalSizeProvider size="md">
              <AIPromptModal cardPublicId={cardId ?? ""} />
            </ModalSizeProvider>
          )}
        </Modal>
      </div>
    </>
  );
}
