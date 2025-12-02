import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function CommentReplyBox({ onReply, onCancel, topLevel = false }) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onReply(text.trim());
    setText("");
  }

  return (
    <div className="w-full">
      {/* Container */}
      <div
        className="
        w-full border border-reddit-border dark:border-reddit-dark_divider
        bg-white dark:bg-reddit-dark_card 
        rounded-3xl px-4 py-3 flex flex-col gap-3
        "
      >
        {/* TEXTAREA */}
        <textarea
          className="
            w-full resize-none outline-none bg-transparent
            text-reddit-text dark:text-reddit-dark_text
            placeholder:text-reddit-text_secondary dark:placeholder:text-reddit-dark_text_secondary
          "
          rows={topLevel ? 4 : 2}
          placeholder={topLevel ? "Add a comment" : "Add your reply"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between">
          
          {/* LEFT: Image & GIF icons */}
          <div className="flex items-center gap-2 text-reddit-icon dark:text-reddit-dark_icon">
            <PhotoIcon className="h-5 w-5 cursor-pointer" />
            <span className="text-xs font-medium cursor-pointer">GIF</span>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
            {/* ... menu button */}
            <button className="
                h-8 w-8 rounded-full flex items-center justify-center
                text-reddit-text_secondary dark:text-reddit-dark_text_secondary
                hover:bg-reddit-hover dark:hover:bg-reddit-dark_hover
              ">
              …
            </button>

            {/* Cancel (only for replies) */}
            {!topLevel && (
              <button
                onClick={onCancel}
                className="
                px-4 py-1 rounded-full text-sm
                bg-reddit-hover dark:bg-reddit-dark_hover
                text-reddit-text dark:text-reddit-dark_text
              ">
                Cancel
              </button>
            )}

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="
                px-4 py-1 rounded-full text-sm font-medium
                bg-reddit-blue hover:bg-reddit-blue_hover 
                text-white disabled:opacity-50
              "
            >
              {topLevel ? "Comment" : "Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
