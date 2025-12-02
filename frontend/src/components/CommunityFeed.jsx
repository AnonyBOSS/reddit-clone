// src/components/CommunityFeed.jsx
import React from "react";
import PostCard from "./PostCard";

/**
 * CommunityFeed
 * - Receives posts array and createPost callback.
 * - Renders PostCard for each post (keeps same PostCard styling).
 */
export default function CommunityFeed({ posts = [], createPost }) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((p) => (
        <PostCard
          key={p.id}
          id={p.id}
          subreddit={p.subreddit}
          author={p.author}
          time={p.time}
          location={p.location}
          title={p.title}
          body={p.body}
          upvotes={p.upvotes}
          comments={p.comments}
          icon={p.icon}
        />
      ))}

      {/* Placeholder when no posts */}
      {posts.length === 0 && (
        <div className="bg-reddit-card dark:bg-reddit-dark_card rounded-xl p-6 border border-reddit-border dark:border-reddit-dark_divider shadow-sm text-reddit-text_secondary">
          No posts yet. Be the first to{" "}
          <button
            onClick={() => createPost && createPost()}
            className="underline text-reddit-text hover:no-underline"
          >
            create a post
          </button>
          .
        </div>
      )}
    </div>
  );
}
