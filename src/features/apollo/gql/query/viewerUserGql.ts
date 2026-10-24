import { gql, type TypedDocumentNode } from '@apollo/client';

import type { ViewerUserQuery, ViewerUserQueryVariables } from '~/features/apollo/generated-types';

export const viewerUserGql: TypedDocumentNode<ViewerUserQuery, ViewerUserQueryVariables> = gql`
  query viewerUser {
    viewer {
      id
      annictId

      username           # ユーザー名
      name               # 表示名
      avatarUrl          # プロフィール画像URL
      description        # プロフィール本文
      url                # URL
      createdAt          # アカウント作成日
      
      notificationsCount # 未読通知数
      followingsCount    # フォローしているユーザー数
      followersCount     # フォロワー数

      recordsCount       # レコード数（視聴記録）
      wannaWatchCount    # 見たい
      watchingCount      # 見てる
      watchedCount       # 見た
      onHoldCount        # 一時停止中
      stopWatchingCount  # 視聴停止
    }
  }
`;