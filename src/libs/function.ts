export function generateDateStyle({ date }: { date: Date }) {
  if (!date) return 0;
  return date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
}

export function getMutedUsers(): { annictId: number, username: string }[] {
  const mutedUsers = localStorage.getItem("mutedUsers");
  return mutedUsers ? JSON.parse(mutedUsers) : [];
}