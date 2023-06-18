import { useState, FormEvent } from "react";
import { useUserComments } from "../context/UserCommentsContext";

type CommentFormProps = {
  commentRootId?: string;
  replyingTo?: string;
  isReplying?: boolean;
  onReply?: () => void;
};

export function CommentForm({
  commentRootId = "",
  replyingTo = "",
  isReplying = false,
  onReply,
}: CommentFormProps) {
  const [content, setContent] = useState(isReplying ? `${replyingTo} ` : "");
  const { currentUser, addComment, addReply } = useUserComments();
  const uuid = crypto.randomUUID();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isReplying) {
      addReply(commentRootId, {
        id: uuid,
        content,
        createdAt: new Date(),
        score: 0,
        replyingTo,
        user: currentUser!,
      });
      onReply && onReply();
    } else {
      addComment({
        id: uuid,
        content,
        createdAt: new Date(),
        score: 0,
        user: currentUser!,
        replies: [],
      });
    }
    setContent("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 flex flex-row flex-wrap md:flex-nowrap gap-4 md:justify-center md:items-start">
        <img
          className="order-1 md:order-none rounded-full w-10 h-10 object-cover"
          src={currentUser!.image.png}
          alt="User profile"
        />
        <textarea
          rows={3}
          placeholder={!isReplying ? "Add a comment..." : ""}
          autoFocus={isReplying}
          onFocus={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.setSelectionRange(target.textLength, target.textLength);
          }}
          className="flex-grow resize-none rounded w-full md:w-auto py-2 px-4 border border-gray-300 border-solid placeholder:text-gray-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="order-1 md:order-none ml-auto uppercase text-sm bg-indigo-600 text-indigo-50 rounded py-3 px-8
        hover:bg-indigo-500 transition-colors"
        >
          {isReplying ? "Reply" : "Send"}
        </button>
      </div>
    </form>
  );
}
