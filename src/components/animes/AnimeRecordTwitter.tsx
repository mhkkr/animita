import { TwitterShareButton } from 'react-share';
import split from 'graphemesplit';

import { ViewerUserQuery, Record, Episode } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

function lengthMax140(comment: string, base: string, url: string) {
  const basePlusUrl = `${base}\n${url}`;
  if (split(`${comment}${basePlusUrl}`).length > 140) {
    const baseLength = split(base).length;
    const urlLength = split(url).length / 2;
    return base + comment.substring(0, (140 - (baseLength + urlLength))) + '...' + '\n\n';
  }
  return base + comment + '\n\n';
}

export default function Edit({ record, episode, user }: { record: Record, episode: Episode, user: ViewerUserQuery }) {
  const url = `https://annict.com/works/${episode.work.annictId}/${episode.annictId}`;
  // const url = `https://annict.com/@${user.viewer?.username}/records/${record.annictId}`;
  const title = record.comment ?
    lengthMax140(record.comment, `#${episode.work.twitterHashtag} ${episode.numberText}\n\n`, url) :
    `${episode.numberText} ${episode.title} #${episode.work.twitterHashtag} を視聴しました。`;

  return (
    <TwitterShareButton
      url={url}
      title={title}
      className="inline-flex items-center"
      type="button"
    >
      <Icons id="twitter" type="brand" className="mr-1.5" />
      シェア
    </TwitterShareButton>
  );
}