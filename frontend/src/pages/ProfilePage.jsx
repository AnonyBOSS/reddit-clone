// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; // your configured axios instance
import PostCard from "../components/PostCard";
import CommentsList from "../components/CommentsList";
import CommentReplyBox from "../components/CommentReplyBox";
import SortMenu from "../components/SortMenu";

/**
 * Right-hand profile info card
 * Accepts a `profile` object with safe defaults.
 */
function ProfileCard({ profile, onFollowToggle, isFollowing }) {
  if (!profile) return null;

  return (
    <div className="bg-reddit-card dark:bg-reddit-dark_card border border-reddit-border dark:border-reddit-dark_divider rounded-2xl p-4 shadow-sm">
      {/* Top: avatar, name */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-reddit-text dark:text-reddit-dark_text truncate">
            {profile.displayName || profile.username}
          </h2>
          <p className="text-xs text-reddit-text_secondary dark:text-reddit-dark_text_secondary truncate">
            u/{profile.username}
          </p>
        </div>
        <button className="text-lg text-reddit-icon dark:text-reddit-dark_icon leading-none">•••</button>
      </div>

      {/* Follow button */}
      <button
        onClick={onFollowToggle}
        className={`w-full mb-4 py-1.5 rounded-full ${
          isFollowing ? "bg-transparent border border-reddit-border text-reddit-text" : "bg-reddit-blue text-white"
        } text-[13px] font-semibold`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>

      {/* Stats row */}
      <div className="flex justify-between text-xs text-reddit-text_light dark:text-reddit-dark_text_light">
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {profile.followersCount ?? 0}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">Followers</div>
        </div>
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {(profile.karma ?? 0).toLocaleString()}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">Karma</div>
        </div>
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {profile.contributions ?? 0}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">Contributions</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
        <div className="mb-2">
          <span className="font-medium text-reddit-text dark:text-reddit-dark_text">
            {profile.redditAgeYears ?? 0} y
          </span>{" "}
          <span>Reddit Age</span>
        </div>
      </div>

      <div className="h-px bg-reddit-divider dark:bg-reddit-dark_divider my-4" />

      {/* Moderated communities */}
      <div className="mb-4">
        <h3 className="text-[11px] font-semibold text-reddit-text_light dark:text-reddit-dark_text_light mb-2">
          MODERATOR OF THESE COMMUNITIES
        </h3>

        {profile.moderatedCommunities?.length ? (
          <div className="space-y-2">
            {profile.moderatedCommunities.map((c) => (
              <div key={c._id || c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-reddit-hover dark:bg-reddit-dark_hover flex items-center justify-center text-[11px]">
                    r/
                  </div>
                  <div className="flex flex-col">
                    <span className="text-reddit-text dark:text-reddit-dark_text">{c.name}</span>
                    <span className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
                      {c.membersCount ?? c.members ?? "—"} members
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1 rounded-full bg-reddit-blue dark:bg-reddit-dark_blue text-[11px] font-semibold text-white">
                  Join
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-reddit-text_secondary dark:text-reddit-dark_text_secondary">No moderated communities</p>
        )}
      </div>
    </div>
  );
}

/**
 * Helper: safe numeric getter for sorting -- checks several possible fields
 */
function getPostScore(post) {
  // prefer `score`, then `votes`, then fallback 0
  if (!post) return 0;
  return Number(post.score ?? post.votes ?? post.upvotes ?? 0);
}

/**
 * ProfilePage - full page component
 */
export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null); // full user profile data from backend
  const [posts, setPosts] = useState([]); // posts created by user
  const [comments, setComments] = useState([]); // optionally recent comments
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "posts" | "comments"
  const [sort, setSort] = useState("best"); // sorting for posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function loadProfile() {
      try {
        const res = await api.get(`/users/${encodeURIComponent(username)}`);
        const data = res.data?.data;

        if (!mounted) return;

        // compute derived properties safely
        const createdAt = data?.createdAt ? new Date(data.createdAt) : null;
        const redditAgeYears = createdAt ? Math.floor((Date.now() - createdAt) / (365 * 24 * 60 * 60 * 1000)) : 0;
        const followersCount = data?.followersCount ?? data?.followers ?? 0;
        const karma = data?.karma ?? 0;
        const commentCount = data?.commentCount ?? data?.commentsCount ?? 0;
        const postCount = (data?.posts && Array.isArray(data.posts)) ? data.posts.length : (data?.postCount ?? 0);
        const contributions = commentCount + postCount;

        setProfile({
          ...data,
          redditAgeYears,
          followersCount,
          karma,
          contributions,
          moderatedCommunities: data?.moderatedCommunities ?? [],
        });

        // posts: backend may return data.posts
        const postsArray = Array.isArray(data?.posts) ? data.posts : [];
        setPosts(postsArray);

        // optionally, if backend returns recent comments, setComments. otherwise empty array
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (err) {
        console.error("Profile load error:", err);
        if (!mounted) return;
        setError(err.response?.data?.error || err.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [username]);

  // Follow toggle (optimistic). Uncomment API call if backend route exists.
  const handleFollowToggle = async () => {
    // optimistic UI change
    setIsFollowing((prev) => !prev);

    // OPTIONAL: if you have an endpoint like POST /api/users/:username/follow
    // try {
    //   await api.post(`/users/${username}/follow`);
    // } catch (err) {
    //   console.error('Follow API failed', err);
    //   // revert optimistic change on failure
    //   setIsFollowing(prev => !prev);
    // }
  };

  if (loading)
    return (
      <div className="pt-10 text-center text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="pt-10 text-center text-red-500">
        Error: {error}
      </div>
    );

  // safe sorted posts
  const sortedPosts = Array.isArray(posts)
    ? [...posts].sort((a, b) =>
        sort === "top" || sort === "best" ? getPostScore(b) - getPostScore(a) : 0
      )
    : [];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4 md:px-6 pt-6 pb-10 flex flex-col lg:flex-row gap-6">
        {/* CENTER: posts/comments content */}
        <section className="flex-1 lg:flex-[2]">
          {/* header: avatar + name */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-reddit-hover dark:bg-reddit-dark_hover flex-shrink-0">
              <img src={profile.avatar || "/default-avatar.png"} alt={profile.username} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-reddit-text dark:text-reddit-dark_text">
                {profile.displayName || profile.username}
              </h1>
              <span className="text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
                u/{profile.username}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {["overview", "posts", "comments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  activeTab === tab
                    ? "bg-reddit-hover dark:bg-reddit-dark_hover text-reddit-text dark:text-reddit-dark_text"
                    : "text-reddit-text_secondary dark:text-reddit-dark_text_secondary hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover"
                }`}
              >
                {tab === "overview" ? "Overview" : tab === "posts" ? "Posts" : "Comments"}
              </button>
            ))}
          </div>

          {/* Sort + controls */}
          <div className="flex items-center gap-3 mb-4">
            <SortMenu value={sort} onChange={setSort} />
          </div>

          {/* Tab content */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              {sortedPosts.length === 0 ? (
                <div className="text-sm text-reddit-text_secondary">No posts yet.</div>
              ) : (
               sortedPosts.map((post) => (
  <PostCard key={post._id} post={post} />
))

              )}
            </div>
          )}

          {activeTab === "overview" && (
            <div>
              <p className="text-sm text-reddit-text_secondary mb-4">Overview</p>

              {/* Example: show recent comments if any */}
              {comments.length ? (
                <>
                  <CommentReplyBox topLevel onReply={() => {}} onCancel={() => {}} />
                  <CommentsList comments={comments} />
                </>
              ) : (
                <p className="text-sm text-reddit-text_secondary">No recent comments to show.</p>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <CommentReplyBox topLevel onReply={() => {}} onCancel={() => {}} />
              <CommentsList comments={comments} />
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full lg:w-80">
          <ProfileCard profile={profile} onFollowToggle={handleFollowToggle} isFollowing={isFollowing} />
        </aside>
      </div>
    </div>
  );
}
