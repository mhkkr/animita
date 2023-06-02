import React from 'react';
import { RiFileUnknowFill } from 'react-icons/ri';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function NotificationIcon(props: Props) {
  switch (props.id) {
    case 'unknow': return <RiFileUnknowFill {...props} />;
  }
  return <></>;
}