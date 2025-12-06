import {
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import VoteButtons from "./VoteButtons";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  if (!post || typeof post !== "object") return null;

  // Extract post fields safely
  const id = post._id;
  const title = post.title ?? "";
  const body = post.body ?? "";
  const score = Number(post.score ?? post.votes ?? 0);
  const commentsCount = post.commentsCount ?? post.commentCount ?? 0;

  const community = post.community?.name ?? "unknown";
  const communityAvatar =
    post.community?.avatar ??
    "https://www.redditstatic.com/avatars/avatar_default_02_46D160.png";

  const author = post.author?.username ?? "user";

  // Format createdAt → short date like "Jan 5"
  const createdAgo = post.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(post.createdAt))
    : "recently";

  return (
    <div
      className="
        w-full max-w-[740px]
        bg-reddit-card dark:bg-reddit-dark_card
        rounded-xl p-4
        border border-reddit-border dark:border-reddit-dark_divider
        shadow-sm
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between text-[13px]">

        {/* LEFT */}
        <div className="flex items-center gap-2 text-reddit-text_secondary dark:text-reddit-dark_text_secondary">

          {/* Community Icon */}
          <Link
            to={`/r/${community}`}
            onClick={(e) => e.stopPropagation()}
            className="h-6 w-6"
          >
            <img src={communityAvatar} className="h-full w-full rounded-full" />
          </Link>

          {/* Community Name */}
          <Link
            to={`/r/${community}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-semibold text-reddit-text dark:text-reddit-dark_text hover:underline"
          >
            r/{community}
          </Link>

          <span>•</span>

          {/* Author */}
          <Link
            to={`/u/${author}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate max-w-[120px] hover:underline"
          >
            u/{author}
          </Link>

          <span>•</span>
          <span>{createdAgo}</span>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-reddit-blue hover:bg-reddit-blue_hover text-white text-xs font-semibold px-3 py-1 rounded-full"
          >
            Join
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-full"
          >
            <EllipsisHorizontalIcon className="h-5 w-5 text-reddit-icon dark:text-reddit-dark_icon" />
          </button>
        </div>

      </div>

      {/* TITLE */}
      <h2
        className="mt-2 text-[18px] font-semibold text-reddit-text dark:text-reddit-dark_text leading-6 cursor-pointer hover:underline"
        onClick={() => navigate(`/post/${id}`)}
      >
        {title}
      </h2>

      {/* BODY */}
      {body && (
        <p className="mt-1 text-[15px] text-reddit-text_light dark:text-reddit-dark_text_light">
          {body}
        </p>
      )}

      {/* ACTION BAR */}
      <div className="flex items-center gap-4 mt-3">

        {/* Votes */}
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButtons initial={score} postId={id} />
        </div>

        {/* Comments Button */}
        <div
          className="
            flex items-center gap-1
            bg-reddit-hover dark:bg-reddit-dark_hover
            px-3 py-[6px] rounded-full
            text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary
            cursor-pointer hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover
          "
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post/${id}`);
          }}
        >
          <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-reddit-icon" />
          <span>{commentsCount}</span>
        </div>

        {/* Share Button */}
        <div
          className="
            flex items-center gap-1
            bg-reddit-hover dark:bg-reddit-dark_hover
            px-3 py-[6px] rounded-full
            text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary
            cursor-pointer hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover
          "
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(
              `${window.location.origin}/post/${id}`
            );
          }}
        >
          <ShareIcon className="h-4 w-4 text-reddit-icon" />
          <span>Share</span>
        </div>

      </div>
    </div>
  );
}
