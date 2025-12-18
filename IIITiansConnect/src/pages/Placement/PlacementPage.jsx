import { useEffect, useState } from "react";
import {
  createPlacement,
  upsertPlacementYear,
  getPlacementByCollege,
} from "../../api/placementApi";

// ⚠️ MUST BE A REAL COLLEGE ID
const COLLEGE_ID = "id-here";


export default function PlacementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placementId, setPlacementId] = useState(null);
  const [existingYears, setExistingYears] = useState([]);
  const [year, setYear] = useState(2024);

  const [placements, setPlacements] = useState([
    {
      branch: "",
      highestPackage: "",
      averagePackage: "",
      lowestPackage: "",
      placementPercentage: "",
      studentsPlaced: "",
      totalStudents: "",
    },
  ]);

  // ---------------- FETCH PLACEMENT (ONE TIME) ----------------
  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        const res = await getPlacementByCollege(COLLEGE_ID);

        if (res.data?._id) {
          setPlacementId(res.data._id);

          if (Array.isArray(res.data.yearlyPlacements)) {
            setExistingYears(
              res.data.yearlyPlacements.map((y) => y.year)
            );
          }
        }
      } catch {
        // placement does not exist yet → OK
      } finally {
        setLoading(false);
      }
    };

    fetchPlacement();
  }, []);

  // ---------------- CREATE (ONE-TIME ONLY) ----------------
  const handleCreatePlacement = async () => {
    setError("");
    try {
      const res = await createPlacement(COLLEGE_ID);
      setPlacementId(res.data._id);
      setExistingYears([]);
      alert("Placement record initialized (one-time)");
    } catch (err) {
      setError("Placement record already exists for this college");
    }
  };

  // ---------------- SAVE / UPDATE YEAR ----------------
  const handleSaveYear = async () => {
    setError("");

    if (!placementId) {
      setError("Initialize placement record first");
      return;
    }

    try {
      const payload = {
        year,
        placements: placements.map((p) => ({
          branch: p.branch,
          highestPackage: Number(p.highestPackage),
          averagePackage: Number(p.averagePackage),
          lowestPackage: Number(p.lowestPackage),
          placementPercentage: Number(p.placementPercentage),
          studentsPlaced: Number(p.studentsPlaced),
          totalStudents: Number(p.totalStudents),
        })),
      };

      await upsertPlacementYear(placementId, payload);

      if (!existingYears.includes(year)) {
        setExistingYears([...existingYears, year]);
      }

      alert(`Placement data saved for ${year}`);
    } catch (err) {
      setError("Failed to save placement data");
    }
  };

  // ---------------- FORM HELPERS ----------------
  const updateField = (i, field, value) => {
    const copy = [...placements];
    copy[i][field] = value;
    setPlacements(copy);
  };

  const addBranch = () => {
    setPlacements([
      ...placements,
      {
        branch: "",
        highestPackage: "",
        averagePackage: "",
        lowestPackage: "",
        placementPercentage: "",
        studentsPlaced: "",
        totalStudents: "",
      },
    ]);
  };

  // ---------------- RENDER ----------------
  if (loading) {
    return <div className="p-10">Loading placements…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">
        Placements Admin
      </h1>

      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      {!placementId && (
        <button
          onClick={handleCreatePlacement}
          className="mb-6 px-5 py-2 bg-indigo-600 text-white rounded"
        >
          Initialize Placement Record (one-time)
        </button>
      )}

      {existingYears.length > 0 && (
        <p className="mb-4 text-sm text-gray-600">
          Existing years: {existingYears.sort().join(", ")}
        </p>
      )}

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Placement Year (Add / Update)
        </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-3 py-2 rounded w-40"
        />
      </div>

      {placements.map((p, i) => (
        <div
          key={i}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 border p-4 rounded"
        >
          <input
            placeholder="Branch"
            value={p.branch}
            onChange={(e) =>
              updateField(i, "branch", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Highest Package"
            value={p.highestPackage}
            onChange={(e) =>
              updateField(i, "highestPackage", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Average Package"
            value={p.averagePackage}
            onChange={(e) =>
              updateField(i, "averagePackage", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Lowest Package"
            value={p.lowestPackage}
            onChange={(e) =>
              updateField(i, "lowestPackage", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Placement %"
            value={p.placementPercentage}
            onChange={(e) =>
              updateField(i, "placementPercentage", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Students Placed"
            value={p.studentsPlaced}
            onChange={(e) =>
              updateField(i, "studentsPlaced", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Total Students"
            value={p.totalStudents}
            onChange={(e) =>
              updateField(i, "totalStudents", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addBranch}
          className="px-4 py-2 border rounded"
        >
          + Add Branch
        </button>

        <button
          onClick={handleSaveYear}
          className="px-6 py-3 bg-black text-white rounded"
        >
          Add / Update Year Data
        </button>
      </div>
    </div>
  );
}
