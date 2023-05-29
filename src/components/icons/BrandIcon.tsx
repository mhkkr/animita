import React from 'react';
import { FaTwitter } from 'react-icons/fa';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export default function BrandIcon(props: Props) {
  switch (props.id) {
    case 'twitter': return <FaTwitter {...props} />;
  }
  return <></>;
}