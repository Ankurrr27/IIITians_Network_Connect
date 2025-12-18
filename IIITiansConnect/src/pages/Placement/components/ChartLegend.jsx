import { METRIC_COLORS } from "./constants";

export default function ChartLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
      {Object.entries(METRIC_COLORS).map(([key, color]) => (
        <div key={key} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
          <span className="capitalize">{key} Package</span>
        </div>
      ))}
    </div>
  );
}
