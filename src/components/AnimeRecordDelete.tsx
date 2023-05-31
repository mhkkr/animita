'use client';

import { useMutation, gql } from '@apollo/client';

import FormIcon from '~/components/icons/FormIcon';

export default function Delete({ recordId }: { recordId: string }) {
  const [deleteRecord, { loading, error }] = useMutation(gql`
    mutation deleteRecord($recordId: ID!) {
      deleteRecord(
        input: {
          recordId: $recordId
        }
      ) {
        episode {
          annictId
        }
      }
    }
  `,{
    update (cache, { data: { deleteRecord } }) {
      // // 追加した商品のキャッシュIDを取得
      // const cacheId = cache.identify(deleteRecord)
      // console.log(cacheId) // Item:4
      // cache.modify({
      //   fields: {
      //     items(existingItemRefs, { toReference }) {
      //       console.log(existingItemRefs) // [{__ref: 'Item:1'}, {__ref: 'Item:2'}, {__ref: 'Item:3'}]
      //       console.log(toReference(cacheId)) // {__ref: 'Item:4'}
      //       return [toReference(cacheId), existingItemRefs]
      //     },
      //   },
      // })
    }
  });

  if (error) {
    console.error(error);
    return <p className="px-4 mb-6 py-6 dark:text-white/70 border-y dark:border-white/25">{error.message}</p>;
  }

  return (
    <button
      onClick={() => deleteRecord({ variables: { recordId: recordId }})}
      className={`inline-flex items-center ${loading ? 'cursor-not-allowed grayscale' : ''}`}
      type="button"
      disabled={loading}
    >
      <FormIcon id="delete" className="mr-1" />
      削除
    </button>
  );
}