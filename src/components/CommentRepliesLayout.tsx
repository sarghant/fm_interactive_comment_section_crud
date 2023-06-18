import { Comment } from "../context/UserCommentsContext";
import { UserComment } from "./UserComment";

type CommentRepliesLayoutProps = {
  commentRootId: string;
  replies: Comment[];
};

export function CommentRepliesLayout({
  commentRootId,
  replies,
}: CommentRepliesLayoutProps) {
  return (
    <div className="relative">
      <div
        className="absolute w-1 rounded-sm bg-gray-200"
        style={{ height: "95%" }}
      ></div>
      <div className="flex flex-col gap-4 ml-10">
        {replies.map((reply) => (
          <UserComment
            key={reply.id}
            commentRootId={commentRootId}
            {...reply}
          />
        ))}
      </div>
    </div>
  );
}
