import Comment from "./Comment";

export default function CommentsList({ comments }) {
  return (
    <section className="mt-6">
      <div className="text-sm text-reddit-text_secondary font-semibold mb-3">
        {comments.length} Comments
      </div>

      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))}
      </div>
    </section>
  );
}
