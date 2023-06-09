import type { Record } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

// TODO: いいねを更新できる API がなかった 2023/06/03
// https://developers.annict.com/docs/graphql-api/beta/reference/mutations/update-record

export default function Favorite({ record }: { record: Record }) {
  return (
    <span className="inline-flex items-center">
      <Icons id="favorite" type="form" className="mr-1" />
      {record.likesCount}
    </span>
    
    // <button
    //   className="inline-flex items-center"
    //   type="button"
    // >
    //   <Icons id="favorite" type="form" className="mr-1" />
    //   {record.likesCount}
    // </button>
  );
}