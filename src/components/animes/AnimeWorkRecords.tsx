"use client";

import { useEffect, useRef, useState } from "react";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useMutation, useQuery } from "@apollo/client/react";
import type { RatingState } from "~/features/apollo/generated-types";
import { viewerUserGql } from "~/features/apollo/gql/query/viewerUserGql";
import {
  workReviewsGql,
  type WorkReview,
} from "~/features/apollo/gql/query/workReviewsGql";
import {
  createReviewGql,
  type ReviewRatingVariables,
} from "~/features/apollo/gql/mutation/createReviewGql";
import { updateReviewGql } from "~/features/apollo/gql/mutation/updateReviewGql";
import { deleteReviewGql } from "~/features/apollo/gql/mutation/deleteReviewGql";

import { useAtom, useSetAtom } from "jotai";
import { muteUpdateAtom } from "~/atoms/muteUpdateAtom";

import Icons from "~/components/icons/Icons";
import { RingSpinner } from "~/components/spinners/Spinner";
import DisplayDate from "~/components/dates/DisplayDate";

import { wasEdited, getMutedUsers } from "~/libs/function";
import { compareByRating } from "~/libs/rating";
import { getSetting } from "~/libs/settings";
import { setLocalStorageItem } from "~/libs/storage";

import Const from "~/constants";

const REVIEW_RATINGS = [
  { key: "ratingOverallState", label: "全体" },
  { key: "ratingAnimationState", label: "映像" },
  { key: "ratingCharacterState", label: "キャラクター" },
  { key: "ratingStoryState", label: "ストーリー" },
  { key: "ratingMusicState", label: "音楽" },
] as const;

type RatingKey = (typeof REVIEW_RATINGS)[number]["key"];
type RatingDraft = Record<RatingKey, RatingState | "">;

const EMPTY_RATINGS: RatingDraft = {
  ratingOverallState: "",
  ratingAnimationState: "",
  ratingCharacterState: "",
  ratingStoryState: "",
  ratingMusicState: "",
};

function ratingsFromReview(review: WorkReview): RatingDraft {
  return {
    ratingOverallState: review.ratingOverallState ?? "",
    ratingAnimationState: review.ratingAnimationState ?? "",
    ratingCharacterState: review.ratingCharacterState ?? "",
    ratingStoryState: review.ratingStoryState ?? "",
    ratingMusicState: review.ratingMusicState ?? "",
  };
}

function ratingVariables(draft: RatingDraft): ReviewRatingVariables {
  const variables: ReviewRatingVariables = {};
  for (const { key } of REVIEW_RATINGS) {
    const value = draft[key];
    if (value) {
      variables[key] = value;
    }
  }
  return variables;
}

function hasBody(review: WorkReview) {
  return Boolean(review.body?.trim());
}

function filterMuted(reviews: WorkReview[]) {
  const mutedIds = new Set(getMutedUsers().map((user) => user.annictId));
  return reviews.filter((review) => !mutedIds.has(review.user.annictId));
}

function RatingChoices({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: RatingState | "";
  disabled: boolean;
  onChange: (value: RatingState | "") => void;
}) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
      <span className="text-xs dark:text-white/70">{label}</span>
      <div className="grid grid-cols-4">
        {Const.RATING_STATE_LIST.map((state) => {
          const selected = value === state.id;
          return (
            <label
              key={state.id}
              className={`
                relative flex items-center justify-center gap-1 p-2 border border-l-0 first:border-l first:rounded-l-md last:rounded-r-md dark:border-stone-500 cursor-pointer text-xs
                transition-colors ${selected ? `${state.bgColor} text-white dark:text-inherit` : ""}
                focus-within:outline focus-within:outline-1 focus-within:outline-offset-2
              `}
            >
              <input
                onClick={(event) => {
                  if (!selected) {
                    return;
                  }
                  event.preventDefault();
                  onChange("");
                }}
                onChange={(event) => onChange(event.target.value as RatingState)}
                className="absolute -z-10 opacity-0"
                type="radio"
                value={state.id}
                checked={selected}
                disabled={disabled}
              />
              <Icons id={state.id} type="rating_state" className={`text-[1.25em] transition-transform ${selected ? "scale-125" : ""}`} />
              <span className="hidden sm:inline">{state.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkRecords({
  workId,
  annictId,
  reviewsCount,
}: {
  workId: string;
  annictId: number;
  reviewsCount: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fetchingAfter = useRef<{ annictId: number; pageSize: number; cursor: string } | null>(null);
  const [body, setBody] = useState("");
  const [ratings, setRatings] = useState<RatingDraft>(EMPTY_RATINGS);
  const [editingId, setEditingId] = useState("");
  const [formError, setFormError] = useState("");
  const pageSize = Math.max(reviewsCount, 1);

  const { data: userData } = useQuery(viewerUserGql);
  const { data, loading, error, fetchMore, refetch } = useQuery(workReviewsGql, {
    variables: { annictIds: [annictId], first: pageSize },
    notifyOnNetworkStatusChange: true,
  });

  const workNode = data?.searchWorks?.nodes?.find((node) => node?.annictId === annictId);
  const reviewsConnection = workNode?.reviews;
  const reviews = (reviewsConnection?.nodes ?? []).filter((review): review is WorkReview => review != null);
  const visibleReviews = filterMuted(reviews);
  const viewerId = userData?.viewer?.annictId;
  const orderedReviews = [...visibleReviews].sort((a, b) => {
    const mineComparison = Number(b.user.annictId === viewerId) - Number(a.user.annictId === viewerId);
    if (mineComparison !== 0) {
      return mineComparison;
    }
    return compareByRating(
      { state: a.ratingOverallState, likesCount: a.likesCount },
      { state: b.ratingOverallState, likesCount: b.likesCount },
    );
  });
  const commentedReviews = orderedReviews.filter((review) => hasBody(review) || review.user.annictId === viewerId);
  const hasOwnReview = orderedReviews.some((review) => review.user.annictId === viewerId);
  const comments = getSetting("displays", "work-comments");
  const showOtherReviews = comments === "visible" || (comments === "record-after-visible" && hasOwnReview);
  const listedReviews = showOtherReviews
    ? commentedReviews
    : commentedReviews.filter((review) => review.user.annictId === viewerId);

  const pageInfo = reviewsConnection?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage ?? false;
  const endCursor = pageInfo?.endCursor;

  useEffect(() => {
    if (!hasNextPage || !endCursor || loading) {
      return;
    }
    if (
      fetchingAfter.current?.annictId === annictId
      && fetchingAfter.current.pageSize === pageSize
      && fetchingAfter.current.cursor === endCursor
    ) {
      return;
    }
    fetchingAfter.current = { annictId, pageSize, cursor: endCursor };
    fetchMore({
      variables: { after: endCursor },
    });
  }, [annictId, pageSize, hasNextPage, endCursor, loading, fetchMore]);

  const hasDraft = body.trim() !== "" || REVIEW_RATINGS.some(({ key }) => ratings[key]);

  useEffect(() => {
    if (!hasDraft) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasDraft]);

  const resetForm = () => {
    setBody("");
    setRatings(EMPTY_RATINGS);
    setEditingId("");
    setFormError("");
  };

  const [createReview, { loading: creating }] = useMutation(createReviewGql);
  const [updateReview, { loading: updating }] = useMutation(updateReviewGql);
  const [deleteReview, { loading: deleting }] = useMutation(deleteReviewGql);
  const submitting = creating || updating || deleting;

  const startEdit = (review: WorkReview) => {
    setEditingId(review.id);
    setBody(review.body);
    setRatings(ratingsFromReview(review));
    setFormError("");
    formRef.current?.scrollIntoView({ block: "nearest" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const variables = { body: body.trim(), ...ratingVariables(ratings) };
    setFormError("");

    try {
      if (editingId) {
        const missing = REVIEW_RATINGS.some(({ key }) => !ratings[key]);
        if (missing) {
          setFormError("変更するには、全体・映像・キャラクター・ストーリー・音楽の評価をすべて選んでください。");
          return;
        }
        await updateReview({
          variables: { reviewId: editingId, ...variables },
        });
      } else {
        await createReview({
          variables: { workId, ...variables },
        });
      }
      resetForm();
      await refetch();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "記録を保存できませんでした。";
      setFormError(message);
    }
  };

  const handleDelete = async (review: WorkReview) => {
    if (!window.confirm("本当に削除しますか？")) {
      return;
    }
    setFormError("");
    try {
      await deleteReview({ variables: { reviewId: review.id } });
      if (editingId === review.id) {
        resetForm();
      }
      await refetch();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "記録を削除できませんでした。";
      setFormError(message);
    }
  };

  return (
    <div className="pt-4">
      <form ref={formRef} onSubmit={handleSubmit} className="mb-4 px-4">
        <textarea
          onChange={(event) => setBody(event.target.value)}
          className="block w-full h-40 p-4 rounded-md border dark:text-black dark:bg-stone-50"
          value={body}
          disabled={submitting}
          placeholder="作品全体の感想を書きましょう！"
        />
        <div className="mt-4 grid gap-2">
          {REVIEW_RATINGS.map((rating) => (
            <RatingChoices
              key={rating.key}
              label={rating.label}
              value={ratings[rating.key]}
              disabled={submitting}
              onChange={(value) => setRatings((current) => ({ ...current, [rating.key]: value }))}
            />
          ))}
        </div>
        {formError && <p className="mt-4 text-red-500">{formError}</p>}
        <button
          className={`
            mt-4 flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white
            transition duration-500 ease-in-out transform bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500
            ${submitting ? "cursor-not-allowed grayscale" : ""}
          `}
          type="submit"
          disabled={submitting}
        >
          {submitting ? <span className="mr-2 text-white"><RingSpinner /></span> : <Icons id={editingId ? "edit" : "publish"} type="form" className="mr-2 text-[1.5em]" />}
          {editingId ? "変更する" : "投稿する"}
        </button>
        {editingId && (
          <button onClick={resetForm} className="mt-4 flex items-center mx-auto text-sm" type="button">
            <Icons id="close" type="navigation" className="mr-2 text-[1.5em]" />
            変更をやめる
          </button>
        )}
      </form>

      {(loading || hasNextPage) && reviews.length === 0 && <div className="py-8 text-center text-5xl text-annict-100"><RingSpinner /></div>}
      {error && <p className="px-4 pt-4 text-red-500">{error.message}</p>}

      <ReviewSummary
        reviews={reviews}
        reviewsCount={workNode?.reviewsCount ?? reviews.length}
        hasOwnReview={hasOwnReview}
      />

      {!loading && !hasNextPage && !error && commentedReviews.length === 0 && (
        <p className="px-4 pt-4 border-t dark:border-stone-700 dark:text-white/70">記録はまだありません。</p>
      )}

      {listedReviews.length > 0 && (
        <ul className="flex flex-wrap text-sm">
          {listedReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              mine={review.user.annictId === viewerId}
              disabled={submitting && (editingId === review.id || deleting)}
              onEdit={() => startEdit(review)}
              onDelete={() => handleDelete(review)}
            />
          ))}
        </ul>
      )}

    </div>
  );
}

function ReviewSummary({
  reviews,
  reviewsCount,
  hasOwnReview,
}: {
  reviews: WorkReview[];
  reviewsCount: number;
  hasOwnReview: boolean;
}) {
  const evaluation = getSetting("displays", "work-evaluation");
  const [muteUpdate] = useAtom(muteUpdateAtom);
  const [filteredReviews, setFilteredReviews] = useState(() => filterMuted(reviews));

  useEffect(() => {
    setFilteredReviews(filterMuted(reviews));
  }, [muteUpdate, reviews]);

  if (evaluation === "invisible" || (evaluation === "record-after-visible" && !hasOwnReview)) {
    return null;
  }

  const ratings = { BAD: 0, AVERAGE: 0, GOOD: 0, GREAT: 0 };
  let ratingCount = 0;
  filteredReviews.forEach((review) => {
    const state = review.ratingOverallState;
    if (!state) {
      return;
    }
    ratings[state] += 1;
    ratingCount += 1;
  });

  if (ratingCount === 0) {
    return null;
  }

  const mutedCount = getMutedUsers().length;
  const maxValue = Math.max(...Object.values(ratings));
  const commentCount = filteredReviews.filter((review) => review.body?.trim()).length;

  return (
    <aside className="mt-4 p-4 border-t dark:border-stone-700 text-sm">
      <div className="flex gap-2">
        <h3 className="flex-none">★みんなの評価</h3>
        <div className="flex-1 flex flex-wrap justify-end gap-x-1.5 gap-y-0.5 dark:text-white/70">
          <span>全投稿{Math.max(0, reviewsCount - mutedCount)}件</span>
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
            <span>評価{ratingCount}件</span>
            <span>感想{commentCount}件</span>
          </div>
        </div>
      </div>
      <ul className="mt-2 flex text-center rounded-md overflow-hidden">
        {Object.entries(ratings).map(([key, value]) => {
          const ratingState = Const.RATING_STATE_LIST.find((item) => item.id === key);
          if (!value) {
            return null;
          }
          return (
            <li
              key={key}
              className={`min-w-4 py-2 ${ratingState?.bgColor} ${maxValue === value ? "font-bold" : ""}`}
              style={{ width: `${(value / ratingCount) * 100}%` }}
              title={ratingState?.label}
            >
              {value}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function ReviewItem({
  review,
  mine,
  disabled,
  onEdit,
  onDelete,
}: {
  review: WorkReview;
  mine: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const setMuteUpdate = useSetAtom(muteUpdateAtom);
  const [muted, setMuted] = useState(false);
  const ratings = REVIEW_RATINGS.flatMap(({ key, label }) => {
    const state = Const.RATING_STATE_LIST.find((item) => item.id === review[key]);
    return state ? [{ key, label, state }] : [];
  });

  return (
    <li className="w-full p-4 border-t dark:border-stone-700">
      <div className={`transition-opacity ${disabled ? "opacity-50" : ""}`}>
        <div className="flex items-center gap-3">
          {muted ? (
            <p>このユーザーをミュートしました。</p>
          ) : (
            <figure className="flex items-center gap-2.5">
              <div className="shrink-0 rounded-full overflow-hidden w-8 h-8">
                <img className="object-cover w-full h-full" src={review.user.avatarUrl || ""} alt="" loading="lazy" />
              </div>
              <figcaption className="line-clamp-2 break-all">{review.user.name}</figcaption>
            </figure>
          )}
          <div className="flex-none ml-auto">
            <Popover className="relative">
              {({ close }) => (
                <>
                  <PopoverPanel
                    transition
                    className="absolute right-0 top-full mt-2 whitespace-nowrap flex flex-col py-0.5 border dark:border-stone-500 bg-white dark:bg-black rounded-md overflow-hidden shadow-lg origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
                    <a className="flex items-center px-2 py-1.5 hover:underline" href={`https://annict.com/@${review.user.username}`} target="_blank" rel="noopener noreferrer">
                      <Icons id="open_in_new" type="link" className="mr-1" />
                      Annict
                    </a>
                    {mine ? (
                      <>
                        <button
                          onClick={() => {
                            onEdit();
                            close();
                          }}
                          className="flex items-center px-2 py-1.5 hover:underline"
                          type="button"
                        >
                          <Icons id="edit" type="form" className="mr-1" />
                          変更
                        </button>
                        <button
                          onClick={() => {
                            onDelete();
                            close();
                          }}
                          className="flex items-center px-2 py-1.5 hover:underline"
                          type="button"
                        >
                          <Icons id="delete" type="form" className="mr-1" />
                          削除
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          toggleMute(review, muted, setMuted);
                          setMuteUpdate((count) => count + 1);
                          close();
                        }}
                        className="flex items-center px-2 py-1.5 hover:underline"
                        type="button"
                      >
                        <Icons id={muted ? "volume_up" : "volume_off"} type="form" className="mr-1" />
                        {muted ? "ミュートを解除" : "ミュートにする"}
                      </button>
                    )}
                  </PopoverPanel>
                  <PopoverButton disabled={disabled}>
                    <Icons id="more_horiz" type="navigation" />
                  </PopoverButton>
                </>
              )}
            </Popover>
          </div>
        </div>
        {!muted && (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center">
                <Icons id="favorite" type="form" className="mr-1" />
                {review.likesCount}
              </span>
              {ratings.map(({ key, label, state }) => (
                <span key={key} className={`inline-flex items-center px-2 py-0.5 rounded-full ${state.bgColor} text-white dark:text-inherit`}>
                  <Icons id={state.id} type="rating_state" className="text-sm mr-1" />
                  {label}
                </span>
              ))}
              <span><DisplayDate date={review.createdAt} /></span>
              {wasEdited(review.createdAt, review.updatedAt) && (
                <span className="dark:text-white/70 text-xs"><DisplayDate date={review.updatedAt} /></span>
              )}
            </div>
            {review.body?.trim() && <p className="mt-3 whitespace-pre-wrap">{review.body}</p>}
          </>
        )}
      </div>
    </li>
  );
}

function toggleMute(review: WorkReview, muted: boolean, setMuted: (value: boolean) => void) {
  const mutedUsers = getMutedUsers();
  if (muted) {
    const next = mutedUsers.filter((user) => user.annictId !== review.user.annictId);
    setLocalStorageItem(Const.STORAGE_MUTED_USERS, JSON.stringify(next));
    setMuted(false);
    return;
  }
  if (!mutedUsers.some((user) => user.annictId === review.user.annictId)) {
    mutedUsers.push({ annictId: review.user.annictId, username: review.user.username });
    setLocalStorageItem(Const.STORAGE_MUTED_USERS, JSON.stringify(mutedUsers));
  }
  setMuted(true);
}
