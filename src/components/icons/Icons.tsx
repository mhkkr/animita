import React from 'react';

import BrandIcon from './BrandIcon';
import FormIcon from './FormIcon';
import LinkIcon from './LinkIcon';
import NavigationIcon from './NavigationIcon';
import NotificationIcon from './NotificationIcon';
import RatingStateIcon from './RatingStateIcon';
import StatusStateIcon from './StatusStateIcon';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function Icons(props: Props) {
  switch (props.type) {
    case 'brand': return <BrandIcon {...props} />;
    case 'form': return <FormIcon {...props} />;
    case 'link': return <LinkIcon {...props} />;
    case 'navigation': return <NavigationIcon {...props} />;
    case 'notification': return <NotificationIcon {...props} />;
    case 'rating_state': return <RatingStateIcon {...props} />;
    case 'status_state': return <StatusStateIcon {...props} />;
  }
  return <></>;
}