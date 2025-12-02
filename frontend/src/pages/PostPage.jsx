// src/pages/PostPage.jsx
import { useState } from "react";
import PostCardFull from "../components/PostCardFull";
import CommentsList from "../components/CommentsList";
import CommentReplyBox from "../components/CommentReplyBox";

export default function PostPage() {
  const [post, setPost] = useState({
    id: 1,
    title: "Example full post title (#2)",
    body: "This is the post content...",
    score: 128,
  });

  // Initial dummy comments
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "alice",
      time: "1h",
      text: "This is a top-level comment.",
      score: 12,
      replies: [
        {
          id: 11,
          author: "bob",
          time: "45m",
          text: "This is a reply.",
          score: 3,
          replies: [],
        },
      ],
    },
    {
      id: 2,
      author: "charlie",
      time: "2h",
      text: "Another comment with no replies.",
      score: 5,
      replies: [],
    },
  ]);

  function addTopLevelComment(text) {
    const newComment = {
      id: Date.now(),
      author: "you",
      time: "now",
      text,
      score: 0,
      replies: [],
    };

    // TODO: send to backend
    setComments((c) => [newComment, ...c]);
  }

  return (
    <div className="px-4 lg:px-0 max-w-[740px] mx-auto mt-6 pb-20">
      
      <PostCardFull postId={post.id} />

      {/* TOP-LEVEL COMMENT BOX */}
      <div className="mt-6 bg-reddit-card dark:bg-reddit-dark_card p-4 rounded-lg border border-reddit-border dark:border-reddit-dark_divider">
        <CommentReplyBox onReply={addTopLevelComment} onCancel={() => {}} topLevel />
      </div>

      {/* COMMENTS */}
      <CommentsList comments={comments} />
    </div>
  );
}
