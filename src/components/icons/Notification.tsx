import React from 'react';
import { MdError } from 'react-icons/md';
import { RiFileUnknowFill } from 'react-icons/ri';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function Notification(props: Props) {
  switch (props.id) {
    case 'unknow': return <RiFileUnknowFill {...props} />;
  }
  return <></>;
}