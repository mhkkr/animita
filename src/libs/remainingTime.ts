export function remainingLabel(startedAt: Date, now: number) {
  const minutesLeft = Math.max(0, Math.floor((startedAt.getTime() - now) / 60000));
  const hours = Math.floor(minutesLeft / 60);
  const minutes = minutesLeft % 60;

  if (hours === 0) {
    return minutes > 0 ? `${minutes}分後` : "1分未満";
  }

  return `${hours}時間後`;
}
