import React from 'react';
import { MdClose, MdArrowBack, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function NavigationIcon(props: Props) {
  switch (props.id) {
    case 'close': return <MdClose {...props} />;
    case 'arrow_back': return <MdArrowBack {...props} />;
    case 'arrow_drop_down': return <MdArrowDropDown {...props} />;
    case 'arrow_drop_up': return <MdArrowDropUp {...props} />;
  }
  return <></>;
}