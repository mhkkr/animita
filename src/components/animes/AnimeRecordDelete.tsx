import { useMutation } from '@apollo/client/react';
import { deleteRecordGql } from '~/features/apollo/gql/mutation/deleteRecordGql';

import { useAtom } from 'jotai';
import { recordDeleteIdAtom } from '~/atoms/recordDeleteIdAtom';
import { recordEditIdAtom } from '~/atoms/recordEditIdAtom';
import type { Episode, Record } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

import { resolveEpisodeRating, useEpisodeRatings, writeEpisodeRating } from '~/libs/episodeRatings';

export default function Delete({
  record,
  episode,
  viewerAnnictId,
  close,
}: {
  record: Record;
  episode: Episode;
  viewerAnnictId?: number | null;
  close: () => void;
}) {
  const [recordDeleteId, setRecordDeleteId] = useAtom(recordDeleteIdAtom);
  const [recordEditId, setRecordEditId] = useAtom(recordEditIdAtom);
  const [, setEpisodeRatings] = useEpisodeRatings();

  const [deleteRecord, { loading, error }] = useMutation(deleteRecordGql, {
    refetchQueries: ["searchWorks", "searchEpisodes"],
    update(cache, { data }) {
      const episodeId = data?.deleteRecord?.episode?.id;
      if (!episodeId) return;

      cache.evict({ id: cache.identify({ __typename: "Record", id: record.id }) });
      cache.modify({
        id: cache.identify({ __typename: "Episode", id: episodeId }),
        fields: {
          // Annict の recordsCount は削除後も減らないことがある
          recordsCount(existing: number = 0) {
            return Math.max(0, existing - 1);
          },
        },
      });
      cache.gc();
    },
    onCompleted() {
      setEpisodeRatings((current) =>
        writeEpisodeRating(
          current,
          episode.annictId,
          resolveEpisodeRating(episode.records?.nodes, viewerAnnictId, null, record.id),
        ),
      );
      if (recordDeleteId) setRecordDeleteId('');
      if (recordEditId) setRecordEditId('');
    }
  });

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <button
      onClick={() => {
        const confirm = window.confirm('本当に削除しますか？');
        if (confirm) {
          setRecordDeleteId(record.id);
          deleteRecord({ variables: { recordId: record.id }});
        }
        close();
      }}
      className={`flex items-center px-2 py-1.5 hover:underline ${loading ? 'cursor-not-allowed grayscale' : ''}`}
      type="button"
      disabled={loading}
    >
      <Icons id="delete" type="form" className="mr-1" />
      削除
    </button>
  );
}