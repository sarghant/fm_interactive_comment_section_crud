import { useUserComments } from "../context/UserCommentsContext";
import { CommentRoot } from "./CommentRoot";

export function CommentsLayout() {
  const { comments } = useUserComments();
  return (
    <div className="flex flex-col gap-4 mb-4">
      {comments.map((comment) => (
        <CommentRoot key={comment.id} commentId={comment.id} />
      ))}
    </div>
  );
}
