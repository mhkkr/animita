export default function DisplayDate({ date }: { date: Date | string }) {
  const _date = typeof date === 'string' ? new Date(date) : date;
  return (
    <>
      {_date.getFullYear()}/
      {_date.getMonth() + 1}/
      {_date.getDate()}&nbsp;
      {_date.getHours().toString().padStart(2, '0')}:
      {_date.getMinutes().toString().padStart(2, '0')}
      <span className="ml-1">({['日','月','火','水','木','金','土'][_date.getDay()]})</span>
    </>
  );
}