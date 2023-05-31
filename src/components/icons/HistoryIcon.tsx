import React from 'react';
import { MdArrowBack } from 'react-icons/md';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function HistoryIcon(props: Props) {
  switch (props.id) {
    case 'arrow_back': return <MdArrowBack {...props} />;
  }
  return <></>;
}