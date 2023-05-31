import React from 'react';
import { HiHashtag } from 'react-icons/hi';
import { MdOpenInNew } from 'react-icons/md';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function LinkIcon(props: Props) {
  switch (props.id) {
    case 'open_in_new': return <MdOpenInNew {...props} />;
    case 'hashtag': return <HiHashtag {...props} />;
  }
  return <></>;
}