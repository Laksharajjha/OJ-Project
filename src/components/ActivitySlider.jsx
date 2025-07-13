import { format, subDays, eachDayOfInterval } from 'date-fns';

export default function ActivitySlider({ submissions }) {
  const today = new Date();
  const pastDays = 90;
  const days = eachDayOfInterval({
    start: subDays(today, pastDays - 1),
    end: today,
  });

  // Build a date-count map
  const submissionMap = {};
  submissions.forEach((s) => {
    const date = format(new Date(s.timestamp), 'yyyy-MM-dd');
    submissionMap[date] = (submissionMap[date] || 0) + 1;
  });

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex space-x-1 px-2 min-w-[600px]">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const count = submissionMap[dateStr] || 0;
          const bgColor =
            count >= 3
              ? 'bg-green-600'
              : count === 2
              ? 'bg-green-400'
              : count === 1
              ? 'bg-green-200'
              : 'bg-gray-200';

          return (
            <div
              key={dateStr}
              title={`${dateStr} • ${count} submission${count !== 1 ? 's' : ''}`}
              className={`w-5 h-5 rounded ${bgColor} hover:scale-110 transition`}
            ></div>
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-2 px-2">
        <span>{format(days[0], 'MMM d')}</span>
        <span className="float-right">{format(days[days.length - 1], 'MMM d')}</span>
      </div>
    </div>
  );
}