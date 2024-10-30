import { TwitterShareButton } from 'react-share';
import split from 'graphemesplit';

import { ViewerUserQuery, Record, Episode } from '~/features/apollo/generated-types';

import Icons from '~/components/icons/Icons';

function lengthMax140(comment: string, base: string, url: string) {
  const basePlusUrl = `${base}\n${url}`;
  if (split(`${comment}${basePlusUrl}`).length > 140) {
    const baseLength = split(base).length;
    const urlLength = split(url).length / 2;
    const subComment = comment.substring(0, (140 - (baseLength + urlLength)));
    if (subComment !== comment) {
      return base + subComment + ' [...]' + '\n\n';
    }
  }
  return base + comment + '\n\n';
}

export default function Twitter({ record, episode, user, close }: { record: Record, episode: Episode, user: ViewerUserQuery, close: () => void }) {
  const url = `https://annict.com/works/${episode.work.annictId}/episodes/${episode.annictId}`;
  // const url = `https://annict.com/@${user.viewer?.username}/records/${record.annictId}`;
  const title = record.comment ?
    lengthMax140(record.comment, `#${episode.work.twitterHashtag} ${episode.numberText}\n\n`, url) :
    `${episode.numberText} ${episode.title} #${episode.work.twitterHashtag} を視聴しました。`;

  return (
    <TwitterShareButton
      url={url}
      title={title}
      className="flex items-center !px-2 !py-1.5 hover:underline"
      type="button"
      onClick={close}
    >
      <Icons id="twitter" type="brand" className="mr-1.5" />
      シェア
    </TwitterShareButton>
  );
}