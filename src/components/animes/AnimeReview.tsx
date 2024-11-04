'use client';

import { useQuery } from '@apollo/client';
import { libraryEntriesGql } from '~/features/apollo/gql/query/libraryEntriesGql';
import type { Work, Episode, LibraryEntriesQuery } from '~/features/apollo/generated-types';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import Icons from '~/components/icons/Icons';

import DisplayDate from '~/components/dates/DisplayDate';
import { RingSpinner } from '~/components/spinners/Spinner';
import * as AnimeEpisode from '~/components/animes/AnimeEpisode';

import Const from '~/constants';

export default function Review({ work }: { work: Work }) {
  return (
    <></>
  );
}