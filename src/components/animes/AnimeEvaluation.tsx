'use client';

import { useEffect, useState } from 'react';

import type { ViewerUserQuery, Episode, Record } from '~/features/apollo/generated-types';

import { useAtom } from 'jotai';
import { muteUpdateAtom } from '~/atoms/muteUpdateAtom';

import { getMutedUsers } from '~/libs/function';
import { getSetting } from '~/libs/settings';

import Const from '~/constants';

// みんなの評価
function Evaluation({ records, episode }: { records: Record[], episode: Episode }) {
  const [muteUpdate, setMuteUpdate] = useAtom(muteUpdateAtom);
  const mutedUsers = getMutedUsers();
  const [filteredRecords, setFilteredRecords] = useState<Record[]>(records.filter(record => !mutedUsers.some(user => user.annictId === record.user.annictId)));

  useEffect(() => {
    const mutedUsers = getMutedUsers();
    setFilteredRecords(records.filter(record => !mutedUsers.some(user => user.annictId === record.user.annictId)));
  }, [muteUpdate, records]);

  let ratingCount = 0;
  const ratings = {
    'BAD' : 0,
    'AVERAGE' : 0,
    'GOOD' : 0,
    'GREAT' : 0
  };

  filteredRecords.forEach(record => {
    if (record.ratingState) {
      ratings[record.ratingState]++;
      ratingCount++;
    }
  });

  if (ratingCount === 0) {
    return <></>;
  }

  const maxValue = Math.max(...Object.values(ratings));
  const commentCount = filteredRecords.filter(record => record?.comment).length;

  return (
    <aside className="p-4 border-t dark:border-stone-700 text-sm">
      <div className="flex gap-2">
        <h2 className="flex-none">★みんなの評価</h2>
        <div className="flex-1 flex flex-wrap justify-end gap-x-1.5 gap-y-0.5 dark:text-white/70">
          <span>全投稿{episode.recordsCount - mutedUsers.length}件</span>
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
            <span>評価{ratingCount}件</span>
            <span>感想{commentCount}件</span>
          </div>
        </div>
      </div>
      {ratingCount > 0 && (
        <ul className="mt-2 flex text-center rounded-md overflow-hidden [contain:content]">
          {Object.entries(ratings).map(([key, value]) => {
            const ratingState = Const.RATING_STATE_LIST.find(RATINGSTATE => RATINGSTATE.id === key);
            return (
              value !== 0 && (
                <li key={key} className={`min-w-4 py-2 ${ratingState?.bgColor} ${maxValue == value ? "font-bold" : ""}`} style={{ width: value / ratingCount * 100 + "%" }} title={ratingState?.label}>
                  {value}
                </li>
              )
            )
          })}
        </ul>
      )}
    </aside>
  )
}

// みんなの評価の表示条件
export default function WrapperEvaluation({ records, episode, user }: { records: Record[], episode: Episode, user: ViewerUserQuery }) {
  const evaluation = getSetting("displays", "evaluation");

  if (evaluation === "invisible") {
    return <></>;
  } else if (evaluation === "record-after-visible") {
    const isMyRecord = records.find(record => record.user.annictId === user.viewer?.annictId);
    if (!isMyRecord) {
      return <></>;
    }
  }

  return <Evaluation records={records} episode={episode} />;
}