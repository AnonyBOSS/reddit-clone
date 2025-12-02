import { useState } from "react";
import VoteButtons from "./VoteButtons";
import CommentReplyBox from "./CommentReplyBox";

export default function Comment({ comment }) {
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  function handleReply(text) {
    const newReply = {
      id: Date.now(),
      author: "you",
      time: "now",
      text,
      score: 0,
      replies: [],
    };

    setReplies((prev) => [...prev, newReply]);
    setShowReply(false);
  }

  return (
    <div>
      <div className="
        bg-reddit-card 
        dark:bg-reddit-dark_card 
        border border-reddit-border 
        dark:border-reddit-dark_divider 
        rounded-lg p-4 
        text-reddit-text 
        dark:text-reddit-dark_text
      ">

        {/* HEADER */}
        <div className="flex items-start gap-3">
          
          {/* Avatar */}
          <div className="
            h-8 w-8 rounded-full 
            bg-reddit-hover 
            dark:bg-reddit-dark_hover
            flex items-center justify-center 
            font-semibold text-reddit-text
            dark:text-reddit-dark_text
          ">
            {comment.author[0].toUpperCase()}
          </div>

          {/* Comment Body */}
          <div className="flex-1">

            {/* Name + Time */}
            <div className="text-sm flex gap-2">
              <span className="font-semibold text-reddit-text dark:text-reddit-dark_text">
                {comment.author}
              </span>
              <span className="text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
                {comment.time}
              </span>
            </div>

            {/* Comment Text */}
            <div className="mt-2 text-reddit-text_light dark:text-reddit-dark_text_light">
              {comment.text}
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-3 text-sm">

              <VoteButtons initial={comment.score} />

              <button
                className="
                  px-2 py-1 rounded 
                  hover:bg-reddit-hover 
                  dark:hover:bg-reddit-dark_hover
                  text-reddit-text_secondary 
                  dark:text-reddit-dark_text_secondary
                "
                onClick={() => setShowReply((s) => !s)}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Box */}
      {showReply && (
        <div className="ml-10 mt-2">
          <CommentReplyBox 
            onReply={handleReply} 
            onCancel={() => setShowReply(false)} 
          />
        </div>
      )}

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="
          ml-10 pl-4 
          border-l border-reddit-border 
          dark:border-reddit-dark_divider 
          mt-3 flex flex-col gap-3
        ">
          {replies.map((r) => (
            <Comment key={r.id} comment={r} />
          ))}
        </div>
      )}
    </div>
  );
}
