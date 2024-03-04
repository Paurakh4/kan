"use client";

import { api } from "~/trpc/react";

import { HiXMark } from "react-icons/hi2";

import { useBoard } from "~/app/providers/board";
import { useModal } from "~/app/providers/modal";

import { Formik, Form, Field } from "formik";

interface FormValues {
  name: string;
}

interface boardPublicId {
  boardPublicId: string;
}

export function NewListForm({ boardPublicId }: boardPublicId) {
  const utils = api.useUtils();
  const { boardData } = useBoard();
  const { closeModal } = useModal();

  const refetchBoard = () =>
    utils.board.byId.refetch({ id: boardData.publicId });

  const createList = api.list.create.useMutation({
    onSuccess: async () => {
      try {
        await refetchBoard();
        closeModal();
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <>
      <div className="flex w-full justify-between pb-4">
        <h2 className="text-sm font-medium text-dark-1000">New list</h2>
        <button
          className="rounded p-1 hover:bg-dark-300"
          onClick={() => closeModal()}
        >
          <HiXMark size={18} className="text-dark-900" />
        </button>
      </div>

      <Formik
        initialValues={{
          name: "",
        }}
        onSubmit={(values: FormValues) => {
          createList.mutate({
            name: values.name,
            boardPublicId,
          });
        }}
      >
        <Form>
          <label
            htmlFor="name"
            className="block pb-2 text-sm font-normal leading-6 text-dark-1000"
          >
            Name
          </label>
          <Field
            id="name"
            name="name"
            className="block w-full rounded-md border-0 bg-dark-300 bg-white/5 py-1.5 text-dark-1000 shadow-sm ring-1 ring-inset ring-dark-700 focus:ring-2 focus:ring-inset focus:ring-dark-700 sm:text-sm sm:leading-6"
          />
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-dark-1000 px-3 py-2 text-sm font-semibold text-dark-50 shadow-sm focus-visible:outline-none"
            >
              Create list
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
}
