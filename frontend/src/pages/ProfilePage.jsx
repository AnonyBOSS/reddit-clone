// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import CommentsList from "../components/CommentsList";
import CommentReplyBox from "../components/CommentReplyBox";
import SortMenu from "../components/SortMenu";

// RIGHT SIDEBAR CARD
function ProfileCard({ profile }) {
  return (
    <div className="bg-reddit-card dark:bg-reddit-dark_card border border-reddit-border dark:border-reddit-dark_divider rounded-2xl p-4 shadow-sm">
      {/* top: name + menu */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-reddit-text dark:text-reddit-dark_text truncate">
            {profile.displayName}
          </h2>
          <p className="text-xs text-reddit-text_secondary dark:text-reddit-dark_text_secondary truncate">
            u/{profile.username}
          </p>
        </div>
        <button className="text-lg text-reddit-icon dark:text-reddit-dark_icon hover:text-reddit-text dark:hover:text-reddit-dark_text leading-none">
          •••
        </button>
      </div>

      {/* follow button */}
      <button className="w-full mb-4 py-1.5 rounded-full bg-reddit-blue hover:bg-reddit-blue_hover dark:bg-reddit-dark_blue dark:hover:bg-reddit-dark_blue_hover text-[13px] font-semibold text-white">
        Follow
      </button>

      {/* stats row */}
      <div className="flex justify-between text-xs text-reddit-text_light dark:text-reddit-dark_text_light">
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {profile.followers}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
            Followers
          </div>
        </div>
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {profile.karma.toLocaleString()}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
            Karma
          </div>
        </div>
        <div>
          <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
            {profile.contributions.toLocaleString()}
          </div>
          <div className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
            Contributions
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
        <div className="mb-2">
          <span className="font-medium text-reddit-text dark:text-reddit-dark_text">
            {profile.redditAgeYears} y
          </span>{" "}
          <span>Reddit Age</span>
        </div>
      </div>

      <div className="h-px bg-reddit-divider dark:bg-reddit-dark_divider my-4" />

      {/* social links */}
      <div className="mb-4">
        <h3 className="text-[11px] font-semibold text-reddit-text_light dark:text-reddit-dark_text_light mb-2">
          SOCIAL LINKS
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.socialLinks.map((link) => (
            <button
              key={`${link.type}-${link.label}`}
              className="px-3 py-1 rounded-full bg-reddit-hover dark:bg-reddit-dark_hover text-xs flex items-center gap-2 hover:bg-reddit-hover_dark dark:hover:bg-reddit-dark_hover text-reddit-text dark:text-reddit-dark_text"
            >
              <span className="text-sm">
                {link.type === "twitter" ? "🐦" : "🎵"}
              </span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* moderated communities */}
      <div className="mb-4">
        <h3 className="text-[11px] font-semibold text-reddit-text_light dark:text-reddit-dark_text_light mb-2">
          MODERATOR OF THESE COMMUNITIES
        </h3>
        <div className="space-y-2">
          {profile.moderatedCommunities.map((c) => (
            <div
              key={c.name}
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
                    {c.members} members
                  </span>
                </div>
              </div>
              <button className="px-3 py-1 rounded-full bg-reddit-blue dark:bg-reddit-dark_blue text-[11px] font-semibold text-white hover:bg-reddit-blue_hover dark:hover:bg-reddit-dark_blue_hover">
                Join
              </button>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full px-3 py-1 rounded-full border border-reddit-border dark:border-reddit-dark_divider text-[11px] text-reddit-text dark:text-reddit-dark_text hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover">
          View all
        </button>
      </div>

      {/* trophy case */}
      <div>
        <h3 className="text-[11px] font-semibold text-reddit-text_light dark:text-reddit-dark_text_light mb-2">
          TROPHY CASE
        </h3>
        <div className="space-y-2 text-xs">
          {profile.trophies.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-reddit-hover dark:bg-reddit-dark_hover grid place-items-center">
                🏅
              </div>
              <div className="flex flex-col">
                <span className="text-reddit-text dark:text-reddit-dark_text">
                  {t.label}
                </span>
                {t.community && (
                  <span className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
                    {t.community}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "posts" | "comments"
  const [sort, setSort] = useState("best");

  // ===== MOCK "API" =====
  async function fetchProfile(u) {
    const name = u || "example_user";
    return {
      username: name,
      displayName: "Example User",
      karma: 213510,
      contributions: 5643,
      redditAgeYears: 9,
      cakeDay: "January 01, 2020",
      about:
        "Frontend dev recreating Reddit for a university project. Loves Tailwind CSS and React.",
      avatar:
        "https://www.redditstatic.com/avatars/avatar_default_07_FF66AC.png",
      banner:
        "https://images.pexels.com/photos/34088/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
      followers: 221,
      following: 32,
      socialLinks: [
        { label: "osuikaa", type: "twitter" },
        { label: "osuikaa", type: "tiktok" },
      ],
      moderatedCommunities: [
        { name: "r/ww3memes", members: "36k" },
        { name: "r/aimemes", members: "2.8k" },
        { name: "r/MemeBroker_app", members: "653" },
      ],
      trophies: [
        { label: "Verified Email", community: null },
        { label: "r/frontend", community: "r/frontend" },
      ],
    };
  }

  async function fetchUserPosts(u) {
    const name = u || "example_user";
    return [
      {
        id: 101,
        subreddit: "frontend",
        author: `u/${name}`,
        time: "4 hours ago",
        location: "web",
        title: "I rebuilt the Reddit profile page UI using Tailwind CSS",
        body: "Part of my university assignment where we have to create a full Reddit clone.",
        upvotes: 321,
        comments: 128,
        icon:
          "https://www.redditstatic.com/avatars/avatar_default_06_FF4500.png",
      },
      {
        id: 102,
        subreddit: "webdev",
        author: `u/${name}`,
        time: "1 day ago",
        location: "web",
        title: "How close should a uni clone be to real Reddit?",
        body: "Matched layout and interactions without copying anything.",
        upvotes: 87,
        comments: 36,
        icon:
          "https://www.redditstatic.com/avatars/avatar_default_01_0DD3BB.png",
      },
    ];
  }

  async function fetchActivity(u) {
    const name = u || "example_user";
    return [
      {
        id: 1,
        community: "r/PlaydateConsole",
        meta: `${name} commented 1 hr. ago`,
        title:
          "Here is a screenshot from our first ever game, Ping-Pongtoon!",
        body: "Looks gorgeous. I don't know what it's about, but I'm intrigued.",
        votes: 3,
      },
      {
        id: 2,
        community: "r/southafrica",
        meta: `${name} replied 3 hr. ago`,
        title:
          "Admit there is a genocide or no World Cup for your team.",
        body: "What if we get to the R16 where all the games are in the US? (I'm delusional)",
        votes: 3,
      },
      {
        id: 3,
        community: "r/godot",
        meta: `${name} commented 4 hr. ago`,
        title: "Everything I need is right here",
        body: "where blender",
        votes: 64,
      },
    ];
  }

  async function fetchComments(u) {
    const name = u || "example_user";
    return [
      {
        id: 1,
        author: name,
        time: "2 hr. ago",
        text: "Looks gorgeous. I don't know what it's about, but I'm intrigued.",
        score: 3,
        replies: [],
      },
      {
        id: 2,
        author: name,
        time: "3 hr. ago",
        text: "What if we get to the R16 where all the games are in the US? (I'm delusional)",
        score: 3,
        replies: [],
      },
      {
        id: 3,
        author: name,
        time: "4 hr. ago",
        text: "where blender",
        score: 64,
        replies: [],
      },
    ];
  }

  // ===== LOAD DATA =====
  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await fetchProfile(username);
      const p = await fetchUserPosts(username);
      const a = await fetchActivity(username);
      const c = await fetchComments(username);
      if (!mounted) return;
      setProfile(u);
      setPosts(p);
      setActivities(a);
      setComments(c);
    })();
    return () => {
      mounted = false;
    };
  }, [username]);

  if (!profile) {
    return (
      <div className="w-full flex justify-center pt-10 text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
        Loading profile…
      </div>
    );
  }

  // ===== SORTED DATA =====
  const sortedActivities = [...activities].sort((a, b) =>
    sort === "top" || sort === "best" ? b.votes - a.votes : 0
  );
  const sortedPosts = [...posts].sort((a, b) =>
    sort === "top" || sort === "best" ? b.upvotes - a.upvotes : 0
  );
  const sortedComments = [...comments].sort((a, b) =>
    sort === "top" || sort === "best" ? b.score - a.score : 0
  );

  // For OVERVIEW: turn activity items into "comments" objects so
  // they render with the same Comment / CommentsList styling.
  const overviewComments = sortedActivities.map((a, idx) => ({
    id: a.id ?? idx,
    author: profile.username,
    time: a.meta,
    text: `${a.community}: ${a.body || a.title}`,
    score: a.votes,
    replies: [],
  }));

  function handleAddComment(text) {
    const name = profile.username;
    const newComment = {
      id: Date.now(),
      author: name,
      time: "just now",
      text,
      score: 1,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
  }

  // ===== RENDER =====
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4 md:px-6 pt-6 pb-10 flex flex-col lg:flex-row gap-6">
        {/* CENTER COLUMN */}
        <section className="flex-1 lg:flex-[2]">
          {/* header: avatar + name */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-reddit-hover dark:bg-reddit-dark_hover flex-shrink-0">
              <img
                src={profile.avatar}
                alt={profile.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-semibold text-reddit-text dark:text-reddit-dark_text">
                {profile.displayName}
              </h1>
              <span className="text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
                u/{profile.username}
              </span>
            </div>
          </div>

          {/* tabs */}
          <div className="flex items-center gap-2 mb-4">
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

          {/* Feed options + SortMenu row */}
          <div className="flex items-center gap-3 mb-4">
            <SortMenu value={sort} onChange={setSort} />
          </div>

          {/* tab content */}
          {activeTab === "overview" && (
            <CommentsList comments={overviewComments} />
          )}

          {activeTab === "posts" && (
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <CommentReplyBox
                topLevel
                onReply={handleAddComment}
                onCancel={() => {}}
              />
              <CommentsList comments={sortedComments} />
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full lg:w-80 lg:flex-shrink-0">
          <ProfileCard profile={profile} />
        </aside>
      </div>
    </div>
  );
}
