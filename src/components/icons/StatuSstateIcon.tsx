import React from 'react';
import { MdPlayArrow, MdFiberManualRecord, MdCheck, MdPause, MdStop } from 'react-icons/md';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function StatuSstateIcon(props: Props) {
  switch (props.id) {
    case 'WATCHING': return <MdPlayArrow {...props} />;
    case 'WANNA_WATCH': return <MdFiberManualRecord {...props} />;
    case 'WATCHED': return <MdCheck {...props} />;
    case 'ON_HOLD': return <MdPause {...props} />;
    case 'STOP_WATCHING': return <MdStop {...props} />;
  }
  return <></>;
}