export default function StatsCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'blue' | 'red' | 'green' | 'teal';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
    teal: 'bg-teal-50 text-teal-700',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`text-3xl font-bold mb-1 ${colors[color].split(' ')[1]}`}>{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
