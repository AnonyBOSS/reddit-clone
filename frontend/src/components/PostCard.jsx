import {
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import VoteButtons from "./VoteButtons";
import { useNavigate, Link } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const score = post?.score ?? 0;
  const comments = post?.commentsCount ?? 0;
  const communityName = post?.community?.name ?? "unknown";
  const authorName = post?.author?.username ?? "user";
  const createdAgo = new Date(post.createdAt).toLocaleDateString(); // you can improve this

  return (
    <div
      onClick={() => navigate(`/post/${post._id}`)}
      className="
        w-full max-w-[740px]
        bg-reddit-card dark:bg-reddit-dark_card
        rounded-xl p-4
        border border-reddit-border dark:border-reddit-dark_divider
        shadow-sm cursor-pointer
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between text-[13px]">

        <div className="flex items-center gap-2 text-reddit-text_secondary dark:text-reddit-dark_text_secondary">

          {/* Subreddit */}
          <Link
            to={`/r/${communityName}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-semibold hover:underline text-reddit-text dark:text-reddit-dark_text"
          >
            r/{communityName}
          </Link>

          <span>•</span>
          <span>Posted by u/{authorName}</span>
          <span>•</span>
          <span>{createdAgo}</span>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-full"
        >
          <EllipsisHorizontalIcon className="h-6 w-6 text-reddit-icon dark:text-reddit-dark_icon" />
        </button>
      </div>

      {/* TITLE */}
      <h2 className="mt-2 text-[20px] font-semibold text-reddit-text dark:text-reddit-dark_text leading-6">
        {post.title}
      </h2>

      {/* BODY */}
      {post.body && (
        <p className="mt-1 text-[15px] text-reddit-text_light dark:text-reddit-dark_text_light">
          {post.body}
        </p>
      )}

      {/* ACTION BAR */}
      <div className="flex items-center gap-4 mt-3">

        {/* VOTES */}
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButtons initial={score} />
        </div>

        {/* COMMENTS */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            flex items-center gap-1
            bg-reddit-hover dark:bg-reddit-dark_hover
            px-3 py-[6px] rounded-full
            text-sm cursor-pointer
            text-reddit-text_secondary dark:text-reddit-dark_text_secondary
            hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover
          "
        >
          <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
          <span>{comments}</span>
        </div>

        {/* SHARE */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.origin + `/post/${post._id}`);
          }}
          className="
            flex items-center gap-1
            bg-reddit-hover dark:bg-reddit-dark_hover
            px-3 py-[6px] rounded-full
            text-sm cursor-pointer
            text-reddit-text_secondary dark:text-reddit-dark_text_secondary
            hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover
          "
        >
          <ShareIcon className="h-4 w-4" />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}
