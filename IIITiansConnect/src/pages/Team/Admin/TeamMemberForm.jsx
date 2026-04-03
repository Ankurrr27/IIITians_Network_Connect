import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import ImageCropModal from "../../../components/ImageCropModal";

const initialForm = {
  name: "",
  role: "",
  roleType: "",
  iiit: "",
  team: "Tech",
  year: "2025-26",
  email: "",
  linkedin: "",
  instagram: "",
  twitter: "",
  order: 0,
};

const transitionOptions = [
  {
    value: "fresh",
    label: "Fresh addition",
    helper: "Add a completely new team member profile.",
  },
  {
    value: "promotion",
    label: "Promotion / role change",
    helper: "Carry forward a member into a higher or different post.",
  },
  {
    value: "continue",
    label: "Continue same tenure",
    helper: "Move a member into the next term with mostly the same details.",
  },
  {
    value: "end",
    label: "End tenure",
    helper: "Mark an existing team member inactive without creating a new entry.",
  },
];

export default function TeamMemberForm({ onSuccess, members = [] }) {
  const [form, setForm] = useState(initialForm);
  const [transitionType, setTransitionType] = useState("fresh");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [endPreviousTenure, setEndPreviousTenure] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [rawPhoto, setRawPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedMember = useMemo(
    () => members.find((member) => member._id === selectedMemberId) || null,
    [members, selectedMemberId]
  );

  useEffect(() => {
    if (!selectedMember || transitionType === "fresh" || transitionType === "end") {
      return;
    }

    setForm({
      name: selectedMember.name || "",
      role:
        transitionType === "continue" ? selectedMember.role || "" : "",
      roleType: selectedMember.roleType || "",
      iiit: selectedMember.iiit || "",
      team: selectedMember.team || "Tech",
      year: form.year || selectedMember.year || "2025-26",
      email: selectedMember.email || "",
      linkedin: selectedMember.linkedin || "",
      instagram: selectedMember.instagram || "",
      twitter: selectedMember.twitter || "",
      order: selectedMember.order ?? 0,
    });
    setPhoto(null);
    setRawPhoto(null);
  }, [selectedMemberId, transitionType]);

  const resetState = () => {
    setForm(initialForm);
    setTransitionType("fresh");
    setSelectedMemberId("");
    setEndPreviousTenure(true);
    setPhoto(null);
    setRawPhoto(null);
  };

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEndTenure = async () => {
    if (!selectedMember) {
      alert("Select a member first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("isActive", "false");
      await api.put(`/team/${selectedMember._id}`, formData);
      resetState();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to end tenure");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (transitionType === "end") {
        await handleEndTenure();
        return;
      }

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      if (photo) {
        formData.append("photo", photo);
      } else if (selectedMember && transitionType !== "fresh") {
        formData.append("photoSourceMemberId", selectedMember._id);
      }

      await api.post("/team", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (
        selectedMember &&
        transitionType !== "fresh" &&
        endPreviousTenure
      ) {
        const previousFormData = new FormData();
        previousFormData.append("isActive", "false");
        await api.put(`/team/${selectedMember._id}`, previousFormData);
      }

      resetState();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save team member");
    } finally {
      setLoading(false);
    }
  };

  const activeMembers = members.filter((member) => member.isActive !== false);

  return (
    <form
      onSubmit={submit}
      className="mx-auto space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-4 sm:p-6"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Team member management
        </h2>
        <p className="text-sm text-slate-600">
          Add new members, promote existing ones, continue the same role into a
          new term, or end tenure from one place.
        </p>
      </div>

      <div className="rounded-[1.4rem] border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
          Transition flow
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {transitionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTransitionType(option.value);
                setSelectedMemberId("");
                if (option.value === "fresh") {
                  setForm(initialForm);
                  setPhoto(null);
                  setRawPhoto(null);
                }
              }}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                transitionType === option.value
                  ? "border-indigo-600 bg-white text-slate-900 shadow-sm"
                  : "border-transparent bg-white/70 text-slate-600 hover:border-indigo-200"
              }`}
            >
              <div className="font-semibold">{option.label}</div>
              <div className="mt-1 text-xs leading-5">{option.helper}</div>
            </button>
          ))}
        </div>
      </div>

      {transitionType !== "fresh" && (
        <div className="space-y-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Select existing member
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Choose the current member record you want to promote, continue, or
              close.
            </p>
          </div>

          <select
            value={selectedMemberId}
            onChange={(event) => setSelectedMemberId(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            required={transitionType !== "fresh"}
          >
            <option value="">Select a team member</option>
            {activeMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} - {member.role} - {member.year}
              </option>
            ))}
          </select>

          {selectedMember && transitionType !== "end" && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={endPreviousTenure}
                  onChange={(event) => setEndPreviousTenure(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                End previous tenure after creating the new entry
              </label>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                Promotion and continuation will reuse the selected member photo automatically unless you upload a new one.
              </div>
            </div>
          )}
        </div>
      )}

      {transitionType === "end" ? (
        <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            This will mark the selected member inactive and remove them from the
            active team listing.
          </p>
        </div>
      ) : (
        <>
          <select
            name="roleType"
            value={form.roleType}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            required
          >
            <option value="">Select Role Category</option>
            <option value="EXEC">President / Vice President</option>
            <option value="LEAD">Lead</option>
            <option value="MEMBER">Team Member</option>
          </select>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["name", "role", "iiit", "email", "linkedin", "instagram", "twitter"].map(
              (key) => (
                <input
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key.toUpperCase()}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                  required={!["linkedin", "instagram", "twitter"].includes(key)}
                />
              )
            )}
          </div>

          <div className="space-y-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="team-photo-upload"
                className="inline-flex cursor-pointer items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
              >
                {photo ? "Replace photo" : "Upload photo"}
              </label>

              <input
                id="team-photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setRawPhoto(file);
                  }
                  e.target.value = "";
                }}
                className="hidden"
                required={transitionType === "fresh" && !photo}
              />

              {photo && (
                <>
                  <button
                    type="button"
                    onClick={() => setRawPhoto(photo)}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Edit photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setRawPhoto(null);
                    }}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    Remove photo
                  </button>
                </>
              )}
            </div>

            {selectedMember && !photo && transitionType !== "fresh" && (
              <p className="text-sm text-slate-500">
                Current member photo will be reused unless you upload a new one.
              </p>
            )}

            {photo && (
              <p className="text-sm text-slate-500">
                Selected photo: <span className="font-medium">{photo.name}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <select
              name="team"
              value={form.team}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            >
              <option>Core</option>
              <option>Tech</option>
              <option>Development</option>
              <option>Design</option>
              <option>Content</option>
              <option>Social Media</option>
            </select>

            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              placeholder="Team term (2025-26)"
            />

            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              placeholder="Display order"
            />
          </div>
        </>
      )}

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
      >
        {loading
          ? "Saving..."
          : transitionType === "promotion"
            ? "Promote member"
            : transitionType === "continue"
              ? "Continue member tenure"
              : transitionType === "end"
                ? "End tenure"
                : "Add member"}
      </button>

      {rawPhoto && (
        <ImageCropModal
          file={rawPhoto}
          onClose={() => setRawPhoto(null)}
          onCrop={(croppedFile) => {
            setPhoto(croppedFile);
            setRawPhoto(null);
          }}
        />
      )}
    </form>
  );
}
