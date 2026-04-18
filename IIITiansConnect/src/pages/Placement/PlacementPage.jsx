import { useEffect, useMemo, useState } from "react";
import { Building2, LoaderCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  createPlacement,
  getPlacementByCollege,
  upsertPlacementYear,
} from "../../api/placementApi";

const createEmptyPlacementRow = () => ({
  branch: "",
  highestPackage: "",
  averagePackage: "",
  lowestPackage: "",
  placementPercentage: "",
  studentsPlaced: "",
  totalStudents: "",
});

export default function PlacementPage() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingPlacement, setLoadingPlacement] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [placementId, setPlacementId] = useState(null);
  const [existingYears, setExistingYears] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [placements, setPlacements] = useState([createEmptyPlacementRow()]);
  const [fullPlacementData, setFullPlacementData] = useState(null);

  useEffect(() => {
    const loadColleges = async () => {
      setLoadingColleges(true);
      try {
        const response = await api.get("/colleges");
        const sortedColleges = [...response.data].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        setColleges(sortedColleges);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load colleges right now."
        );
      } finally {
        setLoadingColleges(false);
      }
    };

    loadColleges();
  }, []);

  useEffect(() => {
    if (!selectedCollegeId) {
      setPlacementId(null);
      setExistingYears([]);
      setPlacements([createEmptyPlacementRow()]);
      setSuccess("");
      return;
    }

    const loadPlacement = async () => {
      setLoadingPlacement(true);
      setError("");
      setSuccess("");
      setPlacementId(null);
      setExistingYears([]);
      setPlacements([createEmptyPlacementRow()]);

      try {
        const response = await getPlacementByCollege(selectedCollegeId);

        if (response.data?._id) {
          setPlacementId(response.data._id);
          setFullPlacementData(response.data);

          if (Array.isArray(response.data.yearlyPlacements)) {
            setExistingYears(
              response.data.yearlyPlacements.map((entry) => entry.year)
            );
          }
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(
            err.response?.data?.message ||
              "Could not load placement data for this college."
          );
        }
      } finally {
        setLoadingPlacement(false);
      }
    };

    loadPlacement();
  }, [selectedCollegeId]);

  const selectedCollege = useMemo(
    () => colleges.find((college) => college._id === selectedCollegeId) || null,
    [colleges, selectedCollegeId]
  );

  useEffect(() => {
    if (!fullPlacementData) {
      setPlacements([createEmptyPlacementRow()]);
      return;
    }

    const entry = (fullPlacementData.yearlyPlacements || []).find(
      (p) => Number(p.year) === Number(year)
    );

    if (entry && Array.isArray(entry.placements) && entry.placements.length > 0) {
      setPlacements(
        entry.placements.map((p) => ({
          branch: p.branch || "",
          highestPackage: p.highestPackage || "",
          averagePackage: p.averagePackage || "",
          lowestPackage: p.lowestPackage || "",
          placementPercentage: p.placementPercentage || "",
          studentsPlaced: p.studentsPlaced || "",
          totalStudents: p.totalStudents || "",
        }))
      );
    } else {
      setPlacements([createEmptyPlacementRow()]);
    }
  }, [year, fullPlacementData]);

  const handleCreatePlacement = async () => {
    if (!selectedCollegeId) {
      setError("Select a college first.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await createPlacement(selectedCollegeId);
      setPlacementId(response.data._id);
      setExistingYears([]);
      setSuccess("Placement record initialized for the selected college.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Placement record already exists for this college."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveYear = async () => {
    if (!selectedCollegeId) {
      setError("Select a college first.");
      return;
    }

    if (!placementId) {
      setError("Initialize the placement record first.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        year,
        placements: placements.map((row) => ({
          branch: row.branch,
          highestPackage: Number(row.highestPackage),
          averagePackage: Number(row.averagePackage),
          lowestPackage: Number(row.lowestPackage),
          placementPercentage: Number(row.placementPercentage),
          studentsPlaced: Number(row.studentsPlaced),
          totalStudents: Number(row.totalStudents),
        })),
      };

      await upsertPlacementYear(placementId, payload);

      if (!existingYears.includes(year)) {
        setExistingYears((prev) => [...prev, year]);
      }

      setSuccess(`Placement data saved for ${selectedCollege?.name} (${year}).`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save placement data."
      );
    } finally {
      setSaving(false);
    }
  };

  const updateField = (index, field, value) => {
    setPlacements((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addBranch = () => {
    setPlacements((prev) => [...prev, createEmptyPlacementRow()]);
  };

  const removeBranch = (index) => {
    setPlacements((prev) =>
      prev.length === 1 ? prev : prev.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  if (loadingColleges) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />
        Loading colleges...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white/80 text-indigo-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-indigo-700 hover:shadow-md active:scale-95"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div className="h-px w-8 bg-slate-200" />
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Placement workspace
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Placements Admin
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Select a college first, then initialize or update its placement data.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              College
            </label>
            <select
              value={selectedCollegeId}
              onChange={(event) => setSelectedCollegeId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select a college</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Building2 className="h-4 w-4 text-indigo-600" />
              Selected college
            </div>
            <div className="mt-2">
              {selectedCollege ? selectedCollege.name : "No college selected yet"}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {!selectedCollegeId ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          Select a college to manage its placement data.
        </div>
      ) : loadingPlacement ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          <LoaderCircle className="mx-auto mb-3 h-5 w-5 animate-spin" />
          Loading placement data for {selectedCollege?.name}...
        </div>
      ) : (
        <>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {selectedCollege?.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {placementId
                    ? "Placement record is ready. Add or update yearly branch data below."
                    : "This college does not have a placement record yet. Initialize it first."}
                </p>
              </div>

              {!placementId && (
                <button
                  type="button"
                  onClick={handleCreatePlacement}
                  disabled={saving}
                  className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Initializing..." : "Initialize Placement Record"}
                </button>
              )}
            </div>

            {existingYears.length > 0 && (
              <p className="mt-5 text-sm text-slate-600">
                Existing years: {existingYears.slice().sort((a, b) => b - a).join(", ")}
              </p>
            )}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Placement Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                className="w-44 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-4">
              {placements.map((row, index) => (
                <div
                  key={index}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Branch row {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeBranch(index)}
                      disabled={placements.length === 1}
                      className="text-sm font-medium text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Branch</label>
                      <input
                        placeholder="e.g. CSE"
                        value={row.branch}
                        onChange={(event) =>
                          updateField(index, "branch", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Highest (LPA)</label>
                      <input
                        type="number"
                        placeholder="e.g. 44"
                        value={row.highestPackage}
                        onChange={(event) =>
                          updateField(index, "highestPackage", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Average (LPA)</label>
                      <input
                        type="number"
                        placeholder="e.g. 19.5"
                        value={row.averagePackage}
                        onChange={(event) =>
                          updateField(index, "averagePackage", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Lowest (LPA)</label>
                      <input
                        type="number"
                        placeholder="e.g. 6"
                        value={row.lowestPackage}
                        onChange={(event) =>
                          updateField(index, "lowestPackage", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Placed %</label>
                      <input
                        type="number"
                        placeholder="e.g. 87"
                        value={row.placementPercentage}
                        onChange={(event) =>
                          updateField(
                            index,
                            "placementPercentage",
                            event.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Students Placed</label>
                      <input
                        type="number"
                        placeholder="e.g. 52"
                        value={row.studentsPlaced}
                        onChange={(event) =>
                          updateField(index, "studentsPlaced", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Total Students</label>
                      <input
                        type="number"
                        placeholder="e.g. 60"
                        value={row.totalStudents}
                        onChange={(event) =>
                          updateField(index, "totalStudents", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={addBranch}
                className="rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                + Add Branch
              </button>

              <button
                type="button"
                onClick={handleSaveYear}
                disabled={!placementId || saving}
                className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add / Update Year Data"}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
