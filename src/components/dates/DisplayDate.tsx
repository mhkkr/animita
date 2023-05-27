export default function DisplayDate({ date }: { date: Date }) {
  return (
    <>
      {date.getFullYear()}/
      {date.getMonth() + 1}/
      {date.getDate()}&nbsp;
      {date.getHours().toString().padStart(2, '0')}:
      {date.getMinutes().toString().padStart(2, '0')}
      <span className="ml-1">({['日','月','火','水','木','金','土'][date.getDay()]})</span>
    </>
  );
}