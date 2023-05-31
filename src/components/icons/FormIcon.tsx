import React from 'react';
import { MdEdit, MdDelete, MdPublish, MdFavorite, MdLogout } from 'react-icons/md';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function FormIcon(props: Props) {
  switch (props.id) {
    case 'edit': return <MdEdit {...props} />;
    case 'delete': return <MdDelete {...props} />;
    case 'publish': return <MdPublish {...props} />;
    case 'favorite': return <MdFavorite {...props} />;
    case 'logout': return <MdLogout {...props} />;
  }
  return <></>;
}