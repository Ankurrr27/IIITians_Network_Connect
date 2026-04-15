import { useState, useEffect, useMemo } from "react";
import { Building2, Images, Trash2, Search, ExternalLink, Sparkles, AlertCircle, LayoutGrid, Filter, Plus, ImagePlus, Upload } from "lucide-react";
import api from "../../api/axios";

const COLLEGE_PLACEHOLDER = "/placeholder.svg";

export default function AdminGallery() {
  const [colleges, setColleges] = useState([]);
  const [selectedId, setSelectedId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Upload States
  const [uploadTargetId, setUploadTargetId] = useState("");
  const [uploadPhotoFile, setUploadPhotoFile] = useState(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const loadColleges = async () => {
    try {
      setLoading(true);
      const res = await api.get("/colleges");
      setColleges(res.data || []);
    } catch (err) {
      setError("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const galleryData = useMemo(() => {
    if (selectedId === "all") {
      return colleges.flatMap((c) =>
        (c.gallery || []).map((img) => ({
          ...img,
          collegeName: c.name,
          collegeId: c._id,
        }))
      );
    }
    const college = colleges.find((c) => c._id === selectedId);
    return (college?.gallery || []).map((img) => ({
      ...img,
      collegeName: college.name,
      collegeId: college._id,
    }));
  }, [colleges, selectedId]);

  const handleUpload = async () => {
    if (!uploadTargetId || !uploadPhotoFile) {
      setError("Please select a college and a photo to upload.");
      return;
    }

    setUploadInProgress(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("images", uploadPhotoFile);
    formData.append("caption", uploadCaption);

    try {
      await api.patch(`/colleges/${uploadTargetId}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Asset published to gallery successfully.");
      setUploadPhotoFile(null);
      setUploadCaption("");
      loadColleges();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload gallery asset.");
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleDelete = async (collegeId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this photo permanently?")) return;

    try {
      await api.delete(`/colleges/${collegeId}/gallery`, { data: { imageUrl } });
      setSuccess("Image removed successfully.");
      
      setColleges((prev) =>
        prev.map((c) =>
          c._id === collegeId
            ? { ...c, gallery: (c.gallery || []).filter((img) => img.url !== imageUrl) }
            : c
        )
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to remove image.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Compact Elite Header */}
      <section className="relative overflow-hidden rounded-2xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-3xl sm:p-8">
        <div className="absolute top-0 right-0 -m-20 h-80 w-80 rounded-full bg-indigo-50/40 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 ring-1 ring-indigo-100">
               Central Gallery Hub
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Audit & <span className="text-indigo-600">Expand</span>
            </h1>
            <p className="max-w-xl text-[13px] font-medium text-slate-500">
              Manage the network's visual memory. Audit contributions or publish official photos.
            </p>
          </div>

          <div className="w-full max-w-[300px] space-y-2">
             <div className="flex items-center justify-between px-1">
               <label className="text-[12px] font-bold text-slate-900">Viewmode</label>
               <span className="text-[10px] font-bold text-indigo-500">{galleryData.length} Items</span>
             </div>
             <div className="group relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600">
                   {selectedId === "all" ? <LayoutGrid size={16} /> : <Building2 size={16} />}
                </div>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all hover:border-indigo-300 focus:ring-2 focus:ring-indigo-600/10"
                >
                  <option value="all">Entire Network</option>
                  <optgroup label="Institutes" className="bg-white text-indigo-600 font-bold">
                    {colleges.map((c) => (
                      <option key={c._id} value={c._id} className="text-slate-900 font-medium">
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                   <Filter size={14} />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Compact Messages */}
      {(error || success) && (
        <div className="animate-in fade-in zoom-in duration-300">
          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-600 ring-1 ring-rose-200">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-600 ring-1 ring-emerald-200">
              <Sparkles size={16} />
              {success}
            </div>
          )}
        </div>
      )}

      {/* Compact Gallery Contributor */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
         <div className="space-y-4 rounded-2xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
               <ImagePlus size={18} className="text-indigo-600" />
               <h2 className="text-sm font-bold text-slate-900">Push to Gallery</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Institute</label>
                  <select
                    value={uploadTargetId}
                    onChange={(e) => setUploadTargetId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] font-medium text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-600/10"
                  >
                    <option value="">-- Select --</option>
                    {colleges.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Caption</label>
                  <input 
                    type="text" 
                    placeholder="Brief description..."
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] font-medium text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-600/10"
                  />
               </div>
            </div>

            <CompactAssetPicker 
              title="Asset"
              file={uploadPhotoFile}
              onPick={(file) => setUploadPhotoFile(file)}
            />

            <button 
              onClick={handleUpload}
              disabled={uploadInProgress}
              className="w-full rounded-xl bg-slate-900 py-3 text-[13px] font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {uploadInProgress ? "Publishing..." : "Publish Asset"}
            </button>
         </div>

         <div className="hidden flex-col justify-center rounded-2xl bg-slate-50/50 p-6 lg:flex border border-slate-100">
            <div className="space-y-3">
               <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
                  <Sparkles size={16} />
               </div>
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Official Push</h3>
               <p className="text-[12px] leading-relaxed text-slate-500 font-medium">
                  Official uploads are marked as verified and appear first in public galleries. Use high-resolution shots.
               </p>
            </div>
         </div>
      </section>

      {/* Grid View */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Manage Library</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              Showing {selectedId === 'all' ? 'Entire Network' : 'Target Institute'}
           </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : galleryData.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {galleryData.map((img, idx) => (
              <div 
                key={img.url + idx}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 transition-all hover:border-indigo-500 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100">
                   <img 
                    src={img.url} 
                    alt={img.caption || "Gallery photo"} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                   <div className="absolute left-2 top-2">
                      <div className="rounded-md bg-white/90 px-2 py-1 text-[9px] font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                        {img.collegeName}
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 p-2.5">
                   <div className="flex-1 overflow-hidden">
                      <p className="truncate text-[12px] font-semibold text-slate-900">
                         {img.caption || "Untitled Memory"}
                      </p>
                   </div>
                   <button 
                      onClick={() => handleDelete(img.collegeId, img.url)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                   >
                      <Trash2 size={14} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
             <Images size={32} className="text-slate-200 mb-4" />
             <h2 className="text-sm font-bold text-slate-900">No photos found</h2>
             <p className="mt-1 text-[12px] text-slate-500 font-medium">Try selecting a different institute.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function CompactAssetPicker({ title, file, onPick }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-indigo-100">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm border border-slate-200">
          <img 
            src={file ? URL.createObjectURL(file) : '/placeholder.svg'} 
            className="h-full w-full object-cover" 
          />
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-bold text-slate-900">{title} Asset</div>
          <div className="mt-1 flex items-center gap-2">
             <label className="cursor-pointer text-[11px] font-bold text-indigo-600 hover:underline">
               {file ? "Change photo" : "Select photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (selected) onPick(selected);
                    event.target.value = "";
                  }}
                />
             </label>
             {file && <span className="text-[10px] text-slate-400 capitalize">{file.name.slice(0, 15)}...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
