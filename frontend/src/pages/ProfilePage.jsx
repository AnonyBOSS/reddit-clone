// src/pages/ProfilePage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; // your configured axios instance
import PostCard from "../components/PostCard";
import CommentsList from "../components/CommentsList";
import CommentReplyBox from "../components/CommentReplyBox";
import SortMenu from "../components/SortMenu";
import EditProfileModal from "../components/EditProfileModal";

/**
 * Right-hand profile info card
 * Accepts a `profile` object with safe defaults.
 */
function ProfileCard({
  profile,
  onFollowToggle,
  isFollowing,
  followLoading,
  loggedInUser,
  onEdit,
}) {
  if (!profile) return null;

  const isOwnProfile = loggedInUser?._id === profile._id;
  const [hover, setHover] = useState(false);

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
        <button className="text-lg text-reddit-icon dark:text-reddit-dark_icon leading-none">
          •••
        </button>
      </div>

      {/* Follow / Edit Button */}
      {isOwnProfile ? (
        <button
          className="w-full mb-4 py-1.5 rounded-full bg-reddit-hover dark:bg-reddit-dark_hover text-[13px] font-semibold focus:outline-none focus:ring-0"
          onClick={onEdit}
        >
          Edit Profile
        </button>
      ) : (
        <button
          onClick={onFollowToggle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}    // keyboard focus behaves like hover
          onBlur={() => setHover(false)}
          disabled={followLoading}
          aria-pressed={isFollowing}
          aria-label={isFollowing ? "Following (press to unfollow)" : "Follow"}
          className={`w-full mb-4 py-1.5 rounded-full transition text-[13px] font-semibold focus:outline-none focus:ring-0 ${
            followLoading
              ? "opacity-60 cursor-not-allowed"
              : isFollowing
              ? "bg-transparent border border-reddit-border text-reddit-text dark:text-white hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover"
              : "bg-reddit-blue text-white"
          }`}
        >
          {isFollowing ? (hover ? "Unfollow" : "Following") : "Follow"}
        </button>
      )}

      {/* Stats row */}
      <div className="flex justify-between text-xs text-reddit-text_light dark:text-reddit-dark_text_light">
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {profile.followersCount ?? 0}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
            Followers
          </div>
        </div>
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {(profile.karma ?? 0).toLocaleString()}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
            Karma
          </div>
        </div>
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {profile.contributions ?? 0}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
            Contributions
          </div>
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
              <div
                key={c._id || c.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-reddit-hover dark:bg-reddit-dark_hover flex items-center justify-center text-[11px]">
                    r/
                  </div>
                  <div className="flex flex-col">
                    <span className="text-reddit-text dark:text-reddit-dark_text">
                      {c.name}
                    </span>
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
          <p className="text-xs text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
            No moderated communities
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Helper: safe numeric getter for sorting -- checks several possible fields
 */
function getPostScore(post) {
  if (!post) return 0;
  return Number(post.score ?? post.votes ?? post.upvotes ?? 0);
}

/**
 * ProfilePage - full page component
 */
export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [sort, setSort] = useState("best");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // prevent race: track mounted and in-flight follow
  const mountedRef = useRef(true);
  const followInFlightRef = useRef(false);

  // Load logged-in user
  useEffect(() => {
    mountedRef.current = true;
    api
      .get("/users/me")
      .then((res) => {
        if (!mountedRef.current) return;
        setLoggedInUser(res.data.data);
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setLoggedInUser(null);
      });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Helper: fetch profile raw data from server
  async function fetchProfileData() {
    const res = await api.get(`/users/${encodeURIComponent(username)}`);
    return res.data?.data;
  }

  // Load profile on mount / username change
  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchProfileData();

        if (!mountedRef.current) return;

        const createdAt = data?.createdAt ? new Date(data.createdAt) : null;
        const redditAgeYears = createdAt
          ? Math.floor((Date.now() - createdAt) / (365 * 24 * 60 * 60 * 1000))
          : 0;
        const followersCount = data?.followersCount ?? data?.followers ?? 0;
        const karma = data?.karma ?? 0;
        const commentCount = data?.commentCount ?? data?.commentsCount ?? 0;
        const postCount =
          data?.posts && Array.isArray(data.posts)
            ? data.posts.length
            : data?.postCount ?? 0;
        const contributions = commentCount + postCount;

        // update profile + derived fields
        setProfile({
          ...data,
          redditAgeYears,
          followersCount,
          karma,
          contributions,
          moderatedCommunities: data?.moderatedCommunities ?? [],
          isFollowing: data?.isFollowing ?? false,
        });

        // sync local following state
        setIsFollowing(data?.isFollowing ?? false);

        setPosts(Array.isArray(data?.posts) ? data.posts : []);
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err.response?.data?.error || err.message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [username]);

  // Follow toggle — optimized, safe, updates followers count & button state
  const handleFollowToggle = async () => {
    if (!profile || followLoading) return;

    // prevent double in-flight requests
    if (followInFlightRef.current) return;
    followInFlightRef.current = true;
    setFollowLoading(true);

    const currentlyFollowing = isFollowing; // snapshot

    // Optimistically update UI: flip button + update follower count
    setIsFollowing(!currentlyFollowing);
    setProfile((prev) => {
      const prevCount = Number(prev?.followersCount ?? 0);
      const nextCount = currentlyFollowing ? Math.max(0, prevCount - 1) : prevCount + 1;
      return { ...prev, followersCount: nextCount, isFollowing: !currentlyFollowing };
    });

    try {
      if (currentlyFollowing) {
        // unfollow
        await api.delete(`/users/${profile.username}/follow`);
      } else {
        // follow
        await api.post(`/users/${profile.username}/follow`);
      }

      // After server success, fetch authoritative values (followersCount/isFollowing)
      // This prevents drift if other clients changed counts
      const updated = await fetchProfileData();
      if (mountedRef.current && updated) {
        setProfile((prev) => ({
          ...prev,
          followersCount: updated.followersCount ?? prev.followersCount,
          isFollowing: updated.isFollowing ?? prev.isFollowing,
        }));
        setIsFollowing(updated.isFollowing ?? false);
      }
    } catch (err) {
      console.error("Follow toggle failed", err);

      // revert optimistic changes on error
      if (mountedRef.current) {
        setIsFollowing(currentlyFollowing);
        setProfile((prev) => ({
          ...prev,
          followersCount: Number(prev?.followersCount ?? 0) + (currentlyFollowing ? 1 : -1) * -1, // revert
        }));
      }
    } finally {
      followInFlightRef.current = false;
      if (mountedRef.current) setFollowLoading(false);
    }
  };

  if (loading)
    return (
      <div className="pt-10 text-center text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
        Loading profile...
      </div>
    );

  if (error)
    return <div className="pt-10 text-center text-red-500">Error: {error}</div>;

  const sortedPosts = Array.isArray(posts)
    ? [...posts].sort((a, b) =>
        sort === "top" || sort === "best" ? getPostScore(b) - getPostScore(a) : 0
      )
    : [];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4 md:px-6 pt-6 pb-10 flex flex-col lg:flex-row gap-6">
        <section className="flex-1 lg:flex-[2]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-reddit-hover dark:bg-reddit-dark_hover flex-shrink-0">
              <img
                src={profile.avatar || "/default-avatar.png"}
                alt={profile.username}
                className="h-full w-full object-cover"
              />
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
                {tab === "overview"
                  ? "Overview"
                  : tab === "posts"
                  ? "Posts"
                  : "Comments"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <SortMenu value={sort} onChange={setSort} />
          </div>

          {activeTab === "posts" && (
            <div className="space-y-4">
              {sortedPosts.length === 0 ? (
                <div className="text-sm text-reddit-text_secondary">No posts yet.</div>
              ) : (
                sortedPosts.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </div>
          )}

          {activeTab === "overview" && (
            <div>
              <p className="text-sm text-reddit-text_secondary mb-4">Overview</p>
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
          <ProfileCard
            profile={profile}
            onFollowToggle={handleFollowToggle}
            isFollowing={isFollowing}
            followLoading={followLoading}
            loggedInUser={loggedInUser}
            onEdit={() => setEditOpen(true)}
          />
        </aside>
      </div>

      {/* 🔥 EDIT PROFILE MODAL */}
      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </div>
  );
}
