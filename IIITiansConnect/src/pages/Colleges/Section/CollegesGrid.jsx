import CollegeCard from "../../../ui/CollegeCard";

export default function CollegesGrid({ colleges, onUpdated }) {
  if (colleges.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No colleges found.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {colleges.map((college) => (
        <CollegeCard
          key={college._id}
          college={college}
          onUpdated={onUpdated}
        />
      ))}
    </div>
  );
}
