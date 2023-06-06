import React from 'react';
import { AiTwotoneThunderbolt } from 'react-icons/ai';
import { FaFire } from 'react-icons/fa';
import { IoFlowerOutline, IoSnow } from 'react-icons/io5';
import { GiIsland } from 'react-icons/gi';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function SpecialAnimeIcon(props: Props) {
  switch (props.id) {
    case 'this': return <IoFlowerOutline {...props} />;
    case 'next': return <GiIsland {...props} />;
    case 'prev': return <IoSnow {...props} />;
    case 'popular': return <FaFire {...props} />;
    case 'new': return <AiTwotoneThunderbolt {...props} />;
  }
  return <></>;
}