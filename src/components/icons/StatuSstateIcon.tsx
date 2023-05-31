import React from 'react';
import { MdPlayArrow, MdOutlinePlayArrow, MdFiberManualRecord, MdOutlineFiberManualRecord, MdCheck, MdCheckCircle, MdStop, MdOutlineStop } from 'react-icons/md';
import { TbPlayerPause, TbPlayerPauseFilled } from 'react-icons/tb';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function StatuSstateIcon(props: Props) {
  switch (props.id) {
    case 'WATCHING': return <MdOutlinePlayArrow {...props} />;
    case 'WATCHING_CURRENT': return <MdPlayArrow {...props} />;

    case 'WANNA_WATCH': return <MdOutlineFiberManualRecord {...props} />;
    case 'WANNA_WATCH_CURRENT': return <MdFiberManualRecord {...props} />;

    case 'WATCHED': return <MdCheck {...props} />;
    case 'WATCHED_CURRENT': return <MdCheckCircle {...props} />;
    
    case 'ON_HOLD': return <TbPlayerPause {...props} />;
    case 'ON_HOLD_CURRENT': return <TbPlayerPauseFilled {...props} />;

    case 'STOP_WATCHING': return <MdOutlineStop {...props} />;
    case 'STOP_WATCHING_CURRENT': return <MdStop {...props} />;
  }
  return <></>;
}