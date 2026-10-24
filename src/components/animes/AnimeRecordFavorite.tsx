import type { Record } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

export default function Favorite({ record }: { record: Record }) {
  return (
    <span className="inline-flex items-center">
      <Icons id="favorite" type="form" className="mr-1" />
      {record.likesCount}
    </span>
  );
}