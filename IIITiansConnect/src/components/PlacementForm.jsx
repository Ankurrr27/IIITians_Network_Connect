import { useState } from "react";
import {
  createPlacement,
  upsertPlacementYear,
} from "../api/placementApi";

export default function PlacementForm({ collegeId }) {
  const [placementId, setPlacementId] = useState("");
  const [year, setYear] = useState(2024);
  const [placements, setPlacements] = useState([
    {
      branch: "CSE",
      highestPackage: 0,
      averagePackage: 0,
      lowestPackage: 0,
      placementPercentage: 0,
      studentsPlaced: 0,
      totalStudents: 0,
    },
  ]);

  const createPlacementDoc = async () => {
    const res = await createPlacement(collegeId);
    setPlacementId(res.data._id);
    alert("Placement document created");
  };

  const submitYear = async () => {
    if (!placementId) {
      alert("Create placement document first");
      return;
    }

    await upsertPlacementYear(placementId, {
      year,
      placements,
    });

    alert("Year data saved");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Placement Admin</h2>

      <button onClick={createPlacementDoc}>
        Create Placement Doc
      </button>

      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(+e.target.value)}
          placeholder="Year"
        />

        {placements.map((p, i) => (
          <div key={i} style={{ marginTop: 10 }}>
            <input
              placeholder="Branch"
              value={p.branch}
              onChange={(e) =>
                updateField(i, "branch", e.target.value)
              }
            />
            <input
              placeholder="Highest"
              type="number"
              value={p.highestPackage}
              onChange={(e) =>
                updateField(i, "highestPackage", +e.target.value)
              }
            />
            <input
              placeholder="Average"
              type="number"
              value={p.averagePackage}
              onChange={(e) =>
                updateField(i, "averagePackage", +e.target.value)
              }
            />
            <input
              placeholder="Lowest"
              type="number"
              value={p.lowestPackage}
              onChange={(e) =>
                updateField(i, "lowestPackage", +e.target.value)
              }
            />
            <input
              placeholder="%"
              type="number"
              value={p.placementPercentage}
              onChange={(e) =>
                updateField(i, "placementPercentage", +e.target.value)
              }
            />
          </div>
        ))}

        <button onClick={submitYear} style={{ marginTop: 10 }}>
          Save Year
        </button>
      </div>
    </div>
  );

  function updateField(index, field, value) {
    const copy = [...placements];
    copy[index][field] = value;
    setPlacements(copy);
  }
}
