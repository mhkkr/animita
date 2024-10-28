import React from 'react';
import { RiFileUnknowFill } from 'react-icons/ri';
import { FaRegBell } from "react-icons/fa6";
import { FaUser, FaRegUser } from "react-icons/fa6";

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function NotificationIcon(props: Props) {
  switch (props.id) {
    case 'unknow': return <RiFileUnknowFill {...props} />;
    case 'bell': return <FaRegBell {...props} />;
    case 'bell': return <FaRegBell {...props} />;
    case 'user': return <FaUser {...props} />;
    case 'reguser': return <FaRegUser {...props} />;
  }
  return <></>;
}