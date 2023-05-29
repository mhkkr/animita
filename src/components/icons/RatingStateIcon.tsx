import React from 'react';
import { MdThumbDown, MdSentimentSatisfied, MdThumbUp, MdFavorite } from 'react-icons/md';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function RatingStateIcon(props: Props) {
  switch (props.id) {
    case 'BAD': return <MdThumbDown {...props} />;
    case 'AVERAGE': return <MdSentimentSatisfied {...props} />;
    case 'GOOD': return <MdThumbUp {...props} />;
    case 'GREAT': return <MdFavorite {...props} />;
  }
  return <></>;
}