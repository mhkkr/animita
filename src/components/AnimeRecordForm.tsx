'use client';

import { useEffect, useRef, useState } from 'react';

import { useMutation } from '@apollo/client';
import { createRecordGql } from '~/features/apollo/gql/mutation/createRecordGql';
import { updateRecordGql } from '~/features/apollo/gql/mutation/updateRecordGql';
import type { Episode } from '~/features/apollo/generated-types';

import { useRecoilState } from 'recoil';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import Icons from '~/components/icons/Icons';

import { RingSpinner } from '~/components/spinners/Spinner';

import Const from '~/constants';

export default function Form({ episode }: { episode: Episode }) {
  const [recordEditId, setRecordEditId] = useRecoilState(recordEditIdAtom);

  const textarea = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState('');
  const [ratingState, setRatingState] = useState('');
  const [shareTwitter, setShareTwitter] = useState(false);

  useEffect(() => {
    if (recordEditId && episode?.records?.nodes) {
      const record = episode?.records?.nodes.find(record => record?.id === recordEditId);

      setComment(record?.comment || '');
      setRatingState(record?.ratingState || '');

      textarea.current?.focus();
    } else {
      setComment('');
      setRatingState('');
    }
  }, [recordEditId]);

  const [createRecord, { loading: cl, error: ce }] = useMutation(createRecordGql, {
    update(cache, { data: { createRecord } }) {
      cache.modify({
        id: cache.identify({ id: createRecord.record.episode.id, __typename: 'Episode' }),
        fields: {}
      });
    },
    onCompleted() {
      setComment('');
      setRatingState('');
      setShareTwitter(false);
    }
  });

  const [updateRecord, { loading: ul, error: ue }] = useMutation(updateRecordGql, {
    update(cache, { data: { updateRecord } }) {
      cache.modify({
        id: cache.identify({ id: updateRecord.record.episode.id, __typename: 'Episode' }),
        fields: {}
      });
    },
    onCompleted() {
      setRecordEditId('');

      setComment('');
      setRatingState('');
      setShareTwitter(false);
    }
  });

  if (ce || ue) {
    console.error(ce || ue);
    return <p className="text-red-500">{ce?.message || ue?.message}</p>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
  
      if (recordEditId && episode?.records?.nodes) {
        const record = episode?.records?.nodes.find(record => record?.id === recordEditId);
        if (ratingState) {
          updateRecord({ variables: { recordId: record?.id, comment: comment, ratingState: ratingState, shareTwitter: shareTwitter }});
        } else {
          updateRecord({ variables: { recordId: record?.id, comment: comment, shareTwitter: shareTwitter }});
        }
      } else {
        if (ratingState) {
          createRecord({ variables: { episodeId: episode.id, comment: comment, ratingState: ratingState, shareTwitter: shareTwitter }});
        } else {
          createRecord({ variables: { episodeId: episode.id, comment: comment, shareTwitter: shareTwitter }});
        }
      }
    }}>
      <textarea
        onChange={e => setComment(e.target.value)}
        ref={textarea}
        className="block w-full h-64 p-4 rounded-md dark:text-black dark:bg-stone-50"
        value={comment}
        disabled={cl || ul}
        placeholder="ここに感想を書きましょう！"
      />
      <div className="mt-4 flex items-center w-full gap-4">
        <div className="flex-1 grid grid-cols-4">
          {Const.RATINGSTATE_LIST.map((RATINGSTATE) => {
            return (
              <label
                key={RATINGSTATE.id}
                className={`
                  relative flex items-center justify-center p-2 border border-l-0 first:border-l first:rounded-l-md last:rounded-r-md dark:border-white/25 cursor-pointer text-xs
                  transition-colors ${ratingState === RATINGSTATE.id ? RATINGSTATE.bgColor : ''}
                  focus-within:outline focus-within:outline-1 focus-within:outline-offset-2
                `}
              >
                <input
                  onChange={e => setTimeout(() => setRatingState(e.target.value), 0)}
                  onClick={e => {
                    if (e.currentTarget.value === ratingState) {
                      e.currentTarget.checked = false;
                      setRatingState('');
                    }
                  }}
                  className="absolute -z-10 opacity-0"
                  type="radio"
                  value={RATINGSTATE.id}
                  checked={ratingState === RATINGSTATE.id}
                  disabled={cl || ul}
                />
                <Icons id={RATINGSTATE.id} type="rating_state" className={`mr-1 text-[1.25em] transition-transform ${ratingState === RATINGSTATE.id ? 'scale-110' : ''}`} />
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
              disabled={cl || ul}
            />
            <Icons
              id="twitter"
              type="brand"
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
          ${cl || ul ? 'cursor-not-allowed grayscale' : ''}
        `}
        type="submit"
        disabled={cl || ul}
      >
        {cl || ul ?
          <span className="mr-2 text-white"><RingSpinner /></span> :
          <Icons id={recordEditId ? 'edit' : 'publish'} type="form" className="mr-2 text-[1.5em]" />
        }
        {recordEditId ? '変更する' : '投稿する'}
      </button>
      {recordEditId &&
        <button onClick={() => setRecordEditId('')} className="mt-4 flex items-center mx-auto text-sm" type="button">
          <Icons id="close" type="navigation" className="mr-2 text-[1.5em]" />
          変更を解除する
        </button>
      }
      <Tooltip id="records-edit-form-tooltip" />
    </form>
  );
}