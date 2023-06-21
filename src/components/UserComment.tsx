import { FormEvent, useMemo, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { User, useUserComments } from "../context/UserCommentsContext";
import { timeAgo } from "../helpers/timeAgo";
import { CommentForm } from "./CommentForm";

type UserCommentProps = {
  commentRootId: string;
  id: string;
  content: string;
  createdAt: Date;
  score: number;
  replyingTo?: string;
  user: User;
};
type CommentActionProps = {
  isCurrentUser: boolean;
  isEditing: boolean;
  isReplying: boolean;
  onClick: () => void;
  onEdit: (showEditForm: boolean) => void;
  onReply: (showReplyForm: boolean) => void;
};
type CommentScoreProps = {
  commentId: string;
  replyId?: string;
  isCurrentUser: boolean;
  score: number;
};
type CommentEditFormProps = {
  commentRootId: string;
  replyId?: string;
  originalContent: string;
  onEdit: () => void;
};
type DeleteCommentModalProps = {
  show: boolean;
  commentRootId: string;
  replyId?: string;
  onClose: () => void;
  onDelete: (id: string, replyId?: string) => void;
};

export function UserComment({
  commentRootId,
  id,
  content,
  createdAt,
  score,
  replyingTo = "",
  user,
}: UserCommentProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { currentUser, deleteComment } = useUserComments();
  const isCurrentUser = currentUser?.username === user.username;
  const timeOfPost = useMemo(() => timeAgo(new Date(createdAt)), [createdAt]);
  const atMentionIndex = content.split(" ").findIndex((c) => c === replyingTo); // Get the index of the @username mention at the start of replies to style it differently compared to the rest of the reply
  const atMention =
    atMentionIndex !== 0 ? "" : content.split(" ")[atMentionIndex];
  return (
    <>
      <div className="relative md:static rounded-lg bg-white p-6 md:flex md:flex-row md:gap-5 md:items-start">
        {/* Score */}
        <CommentScore
          commentId={id}
          replyId={commentRootId === id ? "" : id}
          isCurrentUser={isCurrentUser}
          score={score}
        />
        {/* Username & comment */}
        <div className="w-full">
          <div className="flex gap-2 justify-between items-center mb-3">
            <div className="flex gap-4 items-center">
              <img
                src={user.image.png}
                alt="Username profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <h5 className="font-medium">
                {user.username}{" "}
                {currentUser && currentUser.username === user.username && (
                  <span className="px-2 py-1 bg-indigo-600 text-indigo-50 text-xs">
                    you
                  </span>
                )}
              </h5>
              <span className="text-gray-500">{timeOfPost}</span>
            </div>
            <CommentAction
              isCurrentUser={isCurrentUser}
              isEditing={isEditing}
              isReplying={isReplying}
              onClick={() => setShowModal(true)}
              onEdit={(showEditForm: boolean) => setIsEditing(showEditForm)}
              onReply={(showReplyForm: boolean) => setIsReplying(showReplyForm)}
            />
          </div>
          {/* Comment text */}
          {isEditing ? (
            <CommentEditForm
              commentRootId={commentRootId}
              replyId={commentRootId === id ? "" : id}
              originalContent={content}
              onEdit={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-gray-500 mb-11 md:mb-0">
              {replyingTo ? (
                <>
                  <span className="cursor font-semibold text-indigo-600">
                    {atMention}{" "}
                  </span>
                  {content
                    .split(" ")
                    .filter((c, i) => {
                      if (atMention) return i > 0;
                      return c;
                    })
                    .join(" ")}
                </>
              ) : (
                content
              )}
            </p>
          )}
        </div>
      </div>
      {isReplying && (
        <CommentForm
          commentRootId={commentRootId}
          replyingTo={`@${user.username}`}
          isReplying={isReplying}
          onReply={() => setIsReplying(false)}
        />
      )}
      <DeleteCommentModal
        show={showModal}
        commentRootId={commentRootId}
        replyId={commentRootId === id ? "" : id}
        onClose={() => setShowModal(false)}
        onDelete={deleteComment}
      />
    </>
  );
}

function CommentAction({
  isCurrentUser,
  isEditing,
  isReplying,
  onClick,
  onEdit,
  onReply,
}: CommentActionProps) {
  if (!isCurrentUser) {
    return (
      <>
        {isReplying ? (
          <button
            onClick={() => onReply(false)}
            className="text-gray-400 font-medium text-sm flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => onReply(true)}
            className="absolute md:static bottom-5 right-6 text-indigo-600 font-medium text-sm flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img src="/images/icon-reply.svg" /> Reply
          </button>
        )}
      </>
    );
  } else {
    return (
      <div className="absolute md:static bottom-5 right-6 flex gap-3">
        <button
          onClick={onClick}
          className="text-red-500 font-medium text-sm flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img src="/images/icon-delete.svg" /> Delete
        </button>
        {isEditing ? (
          <button
            onClick={() => onEdit(false)}
            className="text-gray-400 font-medium text-sm flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => onEdit(true)}
            className="text-indigo-600 font-medium text-sm flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img src="/images/icon-edit.svg" /> Edit
          </button>
        )}
      </div>
    );
  }
}

function CommentScore({
  commentId,
  replyId,
  isCurrentUser,
  score,
}: CommentScoreProps) {
  const { handleCommentScore } = useUserComments();
  return (
    <div className="absolute md:static bottom-4 left-5 flex-shrink-0 bg-gray-100 text-gray-400 rounded-lg p-2 md:py-4 md:px-0 w-max md:w-10 flex md:flex-col items-center gap-4">
      <button
        disabled={isCurrentUser}
        onClick={() => handleCommentScore(commentId, "upvote", replyId)}
        className="rounded-full p-1 hover:bg-gray-300 hover:bg-opacity-50 transition-colors"
      >
        <img src="/images/icon-plus.svg" />
      </button>
      <span
        className={`font-semibold ${
          score < 0 ? "text-red-600" : "text-indigo-700"
        }`}
      >
        {score}
      </span>
      <button
        disabled={isCurrentUser}
        onClick={() => handleCommentScore(commentId, "downvote", replyId)}
        className="rounded-full py-2 px-1 hover:bg-gray-300 hover:bg-opacity-50 transition-colors"
      >
        <img src="/images/icon-minus.svg" />
      </button>
    </div>
  );
}

function CommentEditForm({
  commentRootId,
  replyId,
  originalContent,
  onEdit,
}: CommentEditFormProps) {
  const [content, setContent] = useState(originalContent);
  const { editComment } = useUserComments();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    editComment(commentRootId, content, replyId);
    onEdit();
  }
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        autoFocus={true}
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="resize-none w-full outline-none rounded py-2 px-4 border border-gray-300 border-solid placeholder:text-gray-500"
      ></textarea>
      <Button
        type="submit"
        className="uppercase font-normal bg-indigo-600 text-sm ml-auto mt-2"
      >
        Update
      </Button>
    </form>
  );
}

function DeleteCommentModal({
  show,
  commentRootId,
  replyId,
  onClose,
  onDelete,
}: DeleteCommentModalProps) {
  return (
    <Modal show={show} size="md" popup>
      <Modal.Body className="mt-6">
        <h2 className="text-gray-600 font-bold text-xl mb-4">Delete comment</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className="flex gap-2">
          <Button onClick={onClose} className="uppercase bg-gray-500">
            No, cancel
          </Button>
          <Button
            onClick={() => {
              onDelete(commentRootId, replyId);
              onClose();
            }}
            className="uppercase bg-red-500"
          >
            Yes, delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
