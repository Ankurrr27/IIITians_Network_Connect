import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import DiscussFeedCard from "../../Discuss/components/DiscussFeedCard";
import { notifyPromise } from "../../../utils/appNotifications";

const DiscussPreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const LIMIT = 3;

  useEffect(() => {
    const promise = api.get("/discuss");

    notifyPromise(promise, {
      loading: "Fetching community discussions...",
      success: "Discussions loaded",
    });

    promise
      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("DISCUSS PREVIEW ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

  const visiblePosts = posts.slice(0, LIMIT);

  return (
    <section className="bg-slate-50/50 py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Community Discussions
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Latest from <span className="text-indigo-600">Discuss</span>
            </h2>
          </div>

          <button
            onClick={() => navigate("/discuss")}
            className="shrink-0 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            View more
          </button>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-[1.8rem] border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-slate-500">No community posts available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visiblePosts.map((post) => (
              <DiscussFeedCard key={post._id} post={post} />
            ))}
            
            <div className="pt-4 text-center sm:hidden">
                <button
                    onClick={() => navigate("/discuss")}
                    className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                    View More Posts
                </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscussPreview;
