'use client';

import { FormEvent, useState } from 'react';

import { useMutation, gql } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/libraryEntriesGql';
import { searchEpisodesGql } from '~/features/apollo/gql/searchEpisodesGql';
import { searchWorksGql } from '~/features/apollo/gql/searchWorksGql';
import type { Episode } from '~/features/apollo/generated-types';

import { FaTwitter } from 'react-icons/fa';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';

export default function Form({ episode }: { episode: Episode }) {
  const [comment, setComment] = useState('');
  const [ratingState, setRatingState] = useState('');
  const [shareTwitter, setShareTwitter] = useState(false);

  const [createRecord, { loading, error }] = useMutation(gql`
    mutation createRecord($episodeId: ID!, $comment: String, $ratingState: RatingState, $shareTwitter: Boolean) {
      createRecord(
        input: {
          episodeId: $episodeId
          comment: $comment
          ratingState: $ratingState
          shareTwitter: $shareTwitter
        }
      ) {
        record {
          annictId
        }
      }
    }
  `, {
    // update (cache, { data: { createRecord } }) {
    //   // 追加した商品のキャッシュIDを取得
    //   const cacheId = cache.identify(createRecord)
    //   console.log(cacheId) // Item:4
    //   cache.modify({
    //     fields: {
    //       items(existingItemRefs, { toReference }) {
    //         console.log(existingItemRefs) // [{__ref: 'Item:1'}, {__ref: 'Item:2'}, {__ref: 'Item:3'}]
    //         console.log(toReference(cacheId)) // {__ref: 'Item:4'}
    //         return [toReference(cacheId), existingItemRefs]
    //       },
    //     },
    //   })
    // },
    onCompleted() {
      setComment('');
      setRatingState('');
      setShareTwitter(false);
    }
  });

  if (error) {
    console.error(error);
    return <p className="px-4 mb-6 py-6 dark:text-white/70 border-y dark:border-white/25">{error.message}</p>;
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (ratingState) {
      createRecord({ variables: {
        episodeId: episode.id,
        comment: comment,
        ratingState: ratingState,
        shareTwitter: shareTwitter
      }});
    } else {
      createRecord({ variables: {
        episodeId: episode.id,
        comment: comment,
        shareTwitter: shareTwitter
      }});
    }
  }

  return (
    <form onSubmit={e => submit(e)}>
      <textarea
        onChange={e => setComment(e.target.value)}
        className="block w-full h-64 p-4 rounded-md dark:text-black dark:bg-stone-50"
        defaultValue={comment}
        disabled={loading}
      />
      <div className="mt-4 flex items-center w-full gap-4">
        <div className="flex-1 grid grid-cols-4 text-xs">
          {Const.RATINGSTATE_LIST.map((RATINGSTATE) => {
            return (
              <label
                key={RATINGSTATE.id}
                className={`
                  relative flex items-center justify-center p-2 border border-l-0 first:border-l first:rounded-l-md last:rounded-r-md dark:border-white/25 cursor-pointer
                  transition-colors ${ratingState === RATINGSTATE.id ? RATINGSTATE.bgColor : ''}
                  focus-within:outline focus-within:outline-1 focus-within:outline-offset-2
                `}>
                <input
                  onChange={e => setRatingState(e.target.value)}
                  className="absolute -z-10 opacity-0"
                  type="radio"
                  value={RATINGSTATE.id}
                  checked={ratingState === RATINGSTATE.id}
                  disabled={loading}
                />
                <span className="material-symbols-outlined material-symbols-outlined--fill !text-[1em] mr-1">{RATINGSTATE.icon}</span>
                {RATINGSTATE.label}
              </label>
            );
          })}
        </div>
        <div className="flex-shrink-0">
          <label className="cursor-pointer">
            <input
              className="hidden"
              onChange={() => setShareTwitter(prevState => !prevState)}
              type="checkbox"
              id="check"
              checked={shareTwitter}
              disabled={loading}
            />
            <FaTwitter
              className={`transition-all ${shareTwitter ? 'text-[#1da1f2]' : 'opacity-30'}`}
              data-tooltip-id="records-edit-form-tooltip" data-tooltip-content={shareTwitter ? 'シェアする' : 'シェアしない'} data-tooltip-place="top"
            />
          </label>
        </div>
      </div>
      <button
        className={`
          mt-4 flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white
          transition duration-500 ease-in-out transform bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500
          ${loading ? 'cursor-not-allowed grayscale' : ''}
        `}
        type="submit"
        disabled={loading}
      >{loading ? <span className="mr-2 text-white"><RingSpinner /></span> : <span className="material-symbols-outlined mr-2">publish</span>}投稿する</button>
      <Tooltip id="records-edit-form-tooltip" />
    </form>
  );
}