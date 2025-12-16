const MiniTeamCard = ({ name, team, college, image }) => {
  return (
    <div className="flex-shrink-0 bg-white border border-gray-200 rounded-md p-2 shadow-sm text-center w-[150px]">

      {/* IMAGE — small, 3:4, no crop */}
      <div className="w-full aspect-[3/4] rounded overflow-hidden bg-gray-100 flex items-center justify-center mb-2">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* TEXT */}
      <h4 className="text-[11px] font-semibold text-gray-900 leading-tight">
        {name}
      </h4>

      <p className="text-[10px] text-indigo-600 leading-tight">
        {team}
      </p>

      <p className="text-[9px] text-gray-500 leading-tight">
        {college}
      </p>
    </div>
  );
};

export default MiniTeamCard;
