import Discuss from "../models/discuss.model.js";
import Event from "../models/Events.model.js";

export const syncDiscussPostToEvent = async (post) => {
  if (!post?._id) return;

  if (post.type !== "event" || post.status !== "approved") {
    await Event.findOneAndDelete({ sourceDiscussPostId: post._id });
    return;
  }

  const eventDate = post.eventDate || post.createdAt || new Date();

  await Event.findOneAndUpdate(
    { sourceDiscussPostId: post._id },
    {
      title: post.title,
      description: post.description || "",
      date: eventDate,
      collegeName: post.collegeName,
      clubName: post.clubName || "",
      link: post.actionLink || "",
      banner: post.banner?.url
        ? {
            public_id: post.banner.public_id,
            url: post.banner.url,
          }
        : null,
      sourceDiscussPostId: post._id,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const backfillApprovedDiscussEvents = async () => {
  const approvedEventPosts = await Discuss.find({
    type: "event",
    status: "approved",
  });

  await Promise.all(approvedEventPosts.map((post) => syncDiscussPostToEvent(post)));
};
