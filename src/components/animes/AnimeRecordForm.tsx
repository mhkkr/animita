'use client';

import { useEffect, useRef, useState } from 'react';

import { useMutation } from '@apollo/client/react';
import type { Episode, RatingState } from '~/features/apollo/generated-types';
import { createRecordGql } from '~/features/apollo/gql/mutation/createRecordGql';
import { updateRecordGql } from '~/features/apollo/gql/mutation/updateRecordGql';

import { useAtom } from 'jotai';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';

import Icons from '~/components/icons/Icons';
import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';

export default function Form({ episode, alreadyRated }: { episode: Episode; alreadyRated: boolean }) {
  const [recordEditId, setRecordEditId] = useAtom(recordEditIdAtom);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState('');
  const [ratingState, setRatingState] = useState<RatingState | ''>('');

  const editingRecord = episode.records?.nodes?.find((record) => record?.id === recordEditId) ?? null;
  const editingRecordId = editingRecord?.id ?? '';
  const editingComment = editingRecord?.comment ?? '';
  const editingRating = editingRecord?.ratingState ?? '';

  useEffect(() => {
    setComment(editingComment);
    setRatingState(editingRating);
    if (editingRecordId) {
      textarea.current?.focus();
    }
  }, [editingRecordId, editingComment, editingRating]);

  useEffect(() => {
    if (alreadyRated) {
      return;
    }
    textarea.current?.focus();
  }, [alreadyRated]);

  useEffect(() => {
    if (!comment) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [comment]);

  const [createRecord, { loading: creating, error: createError }] = useMutation(createRecordGql, {
    refetchQueries: ["searchWorks"],
    onCompleted() {
      setComment('');
      setRatingState('');
    },
  });

  const [updateRecord, { loading: updating, error: updateError }] = useMutation(updateRecordGql, {
    onCompleted() {
      setRecordEditId('');
      setComment('');
      setRatingState('');
    },
  });

  const submitting = creating || updating;
  const mutationError = createError || updateError;

  if (mutationError) {
    return <p className="text-red-500">{mutationError.message}</p>;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const variables = { comment, ratingState: ratingState || undefined };

    if (editingRecord?.id) {
      updateRecord({ variables: { recordId: editingRecord.id, ...variables } });
      return;
    }

    createRecord({ variables: { episodeId: episode.id, ...variables } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        onChange={(event) => setComment(event.target.value)}
        ref={textarea}
        className="block w-full h-64 p-4 rounded-md border dark:text-black dark:bg-stone-50"
        value={comment}
        disabled={submitting}
        placeholder="このエピソードの感想を書きましょう！"
      />
      <div className="mt-4 grid grid-cols-4">
        {Const.RATING_STATE_LIST.map((state) => {
          const selected = ratingState === state.id;
          return (
            <label
              key={state.id}
              className={`
                relative flex flex-col sm:flex-row gap-1 items-center justify-center p-2 border border-l-0 first:border-l first:rounded-l-md last:rounded-r-md dark:border-stone-500 cursor-pointer text-xs
                transition-colors ${selected ? `${state.bgColor} text-white dark:text-inherit` : ''}
                focus-within:outline focus-within:outline-1 focus-within:outline-offset-2
              `}
            >
              <input
                onClick={(event) => {
                  if (!selected) {
                    return;
                  }
                  event.preventDefault();
                  setRatingState('');
                }}
                onChange={(event) => setRatingState(event.target.value as RatingState)}
                className="absolute -z-10 opacity-0"
                type="radio"
                value={state.id}
                checked={selected}
                disabled={submitting}
              />
              <Icons id={state.id} type="rating_state" className={`text-[1.25em] transition-transform ${selected ? 'scale-125' : ''}`} />
              {state.label}
            </label>
          );
        })}
      </div>
      <button
        className={`
          mt-4 flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white
          transition duration-500 ease-in-out transform bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500
          ${submitting ? 'cursor-not-allowed grayscale' : ''}
        `}
        type="submit"
        disabled={submitting}
      >
        {submitting ?
          <span className="mr-2 text-white"><RingSpinner /></span> :
          <Icons id={editingRecord ? 'edit' : 'publish'} type="form" className="mr-2 text-[1.5em]" />
        }
        {editingRecord ? '変更する' : '投稿する'}
      </button>
      {editingRecord &&
        <button onClick={() => setRecordEditId('')} className="mt-4 flex items-center mx-auto text-sm" type="button">
          <Icons id="close" type="navigation" className="mr-2 text-[1.5em]" />
          変更をやめる
        </button>
      }
    </form>
  );
}
