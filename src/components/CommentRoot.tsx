import { useUserComments } from "../context/UserCommentsContext";
import { UserComment } from "./UserComment";
import { CommentRepliesLayout } from "./CommentRepliesLayout";

type CommentRootProps = {
  commentId: string;
};

export function CommentRoot({ commentId }: CommentRootProps) {
  const { comments } = useUserComments();
  const currentComment = comments.find((comment) => comment.id === commentId)!;
  const replies = currentComment.replies;
  return (
    <>
      <UserComment commentRootId={commentId} {...currentComment} />
      {replies && replies.length > 0 && (
        <CommentRepliesLayout
          commentRootId={commentId}
          replies={currentComment.replies!}
        />
      )}
    </>
  );
}
