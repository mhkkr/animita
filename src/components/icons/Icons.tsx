import React from 'react';

import BrandIcon from '~/components/icons/BrandIcon';
import FormIcon from '~/components/icons/FormIcon';
import LinkIcon from '~/components/icons/LinkIcon';
import NavigationIcon from '~/components/icons/NavigationIcon';
import NotificationIcon from '~/components/icons/NotificationIcon';
import RatingStateIcon from '~/components/icons/RatingStateIcon';
import SpecialAnimeIcon from '~/components/icons/SpecialAnimeIcon';
import StatusStateIcon from '~/components/icons/StatusStateIcon';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function Icons(props: Props) {
  switch (props.type) {
    case 'brand': return <BrandIcon {...props} />;
    case 'form': return <FormIcon {...props} />;
    case 'link': return <LinkIcon {...props} />;
    case 'navigation': return <NavigationIcon {...props} />;
    case 'notification': return <NotificationIcon {...props} />;
    case 'rating_state': return <RatingStateIcon {...props} />;
    case 'special_anime': return <SpecialAnimeIcon {...props} />;
    case 'status_state': return <StatusStateIcon {...props} />;
  }
  return <></>;
}