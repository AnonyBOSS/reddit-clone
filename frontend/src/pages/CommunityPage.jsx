// src/pages/CommunityPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommunityHeader from "../components/CommunityHeader";
import CommunityFeed from "../components/CommunityFeed";
import CommunitySidebar from "../components/CommunitySidebar";

export default function CommunityPage() {
  const { name } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);

  // Mock fetch functions (replace with real API next)
  async function fetchCommunity(n) {
    return {
      name: n,
      title: `r/${n}`,
      description: "The official community. Share and discuss here.",
      members: 126000,
      active: 350,
      created: "Dec 30, 2021",
      rules: [
        "All content must be safe",
        "All posts must be related",
        "No spam",
        "Be respectful",
      ],
      icon: "https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png",
      // sample banner — you can change to local asset later
      banner:
        "https://images.unsplash.com/photo-1564865886603-4c1b8f3e1a3b?auto=format&fit=crop&w=1400&q=60",
    };
  }

  async function fetchPosts(n) {
    return [
      {
        id: 101,
        subreddit: n,
        author: "alice",
        time: "2h",
        location: `r/${n}`,
        title: "Welcome to the community",
        body: "This is the first post in the community.",
        upvotes: 34,
        comments: 12,
        icon: "https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png",
      },
      {
        id: 102,
        subreddit: n,
        author: "bob",
        time: "1d",
        location: `r/${n}`,
        title: "Second post — discuss here",
        body: "What do you think about the new trailer?",
        upvotes: 12,
        comments: 3,
        icon: "https://www.redditstatic.com/avatars/avatar_default_06_FF4500.png",
      },
    ];
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const c = await fetchCommunity(name || "example");
      const p = await fetchPosts(name || "example");
      if (!mounted) return;
      setCommunity(c);
      setPosts(p);
    })();
    return () => {
      mounted = false;
    };
  }, [name]);

  // Placeholder actions for future backend integration
  async function joinCommunity() {
    // TODO: call backend — intentionally empty for now
    return true;
  }

  async function createPost(dummy) {
    // TODO: call backend / open modal
    const newPost = {
      id: Date.now(),
      subreddit: community?.name || name,
      author: "you",
      time: "now",
      location: `r/${community?.name || name}`,
      title: dummy?.title || "New post",
      body: dummy?.body || "",
      upvotes: 0,
      comments: 0,
      icon: community?.icon,
    };
    setPosts((s) => [newPost, ...s]);
    return newPost;
  }

  if (!community) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-reddit-text dark:text-reddit-dark_text">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-reddit-page dark:bg-reddit-dark_bg text-reddit-text dark:text-reddit-dark_text min-h-screen">
      {/* Center container — match Reddit feel; wider container */}
      <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-6">
        {/* COMMUNITY HEADER / BANNER */}
        <CommunityHeader
          community={community}
          onJoin={joinCommunity}
          onCreatePost={() => createPost()}
        />

        {/* SORT / VIEW + page grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FEED (center) */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-[740px]">
              <CommunityFeed posts={posts} createPost={createPost} />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="w-[320px] space-y-4">
              <CommunitySidebar community={community} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
