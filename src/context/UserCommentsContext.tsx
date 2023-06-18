import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Image = {
  png?: string;
  webp?: string;
};
export type User = {
  image: Image;
  username: string;
};
export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  score: number;
  replyingTo?: string;
  user: User;
  replies?: Comment[];
};
type UserCommentsContext = {
  currentUser: User | null;
  comments: Comment[];
  submitUser: (user: User) => void;
  signout: () => void;
  addComment: (comment: Comment) => void;
  editComment: (id: string, content: string, replyId?: string) => void;
  deleteComment: (id: string, replyId?: string) => void;
  addReply: (id: string, commentReply: Comment) => void;
  handleCommentScore: (id: string, vote: string) => void;
};
type UserCommentsProviderProps = {
  children: ReactNode;
};

const UserCommentsContext = createContext({} as UserCommentsContext);

export function useUserComments() {
  return useContext(UserCommentsContext);
}

export function UserCommentsProvider({ children }: UserCommentsProviderProps) {
  const [comments, setComments] = useLocalStorage<Comment[]>("COMMENTS", []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>(
    "CURRENT USER",
    {} as User
  );
  function submitUser(user: User) {
    setCurrentUser(user);
  }
  function signout() {
    setCurrentUser(null);
  }
  function addComment(comment: Comment) {
    setComments((c) => [...c, comment]);
  }
  function editComment(
    id: string,
    content: string,
    replyId: string | undefined
  ) {
    setComments((c) => {
      return c.map((comment) => {
        if (comment.id === id && !replyId) {
          return { ...comment, content };
        }
        if (replyId) {
          const updatedReplies = comment.replies!.map((reply) => {
            if (reply.id === replyId) {
              return { ...reply, content };
            } else {
              return reply;
            }
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
    });
  }
  function deleteComment(id: string, replyId: string | undefined) {
    setComments((c) => {
      if (replyId) {
        return c.map((comment) => {
          if (comment.id === id) {
            const replies = comment.replies!;
            const filteredReplies = replies.filter(
              (reply) => reply.id !== replyId
            );
            return { ...comment, replies: filteredReplies };
          } else {
            return comment;
          }
        });
      } else {
        return c.filter((comment) => comment.id !== id);
      }
    });
  }
  function addReply(id: string, commentReply: Comment) {
    setComments((c) =>
      c.map((comment) => {
        if (comment.id === id) {
          return { ...comment, replies: [...comment.replies!, commentReply] };
        } else {
          return comment;
        }
      })
    );
  }
  function handleCommentScore(id: string, vote: string) {
    setComments((c) =>
      c.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            score: vote === "downvote" ? comment.score-- : comment.score++,
          };
        } else {
          return comment;
        }
      })
    );
  }
  return (
    <UserCommentsContext.Provider
      value={{
        currentUser,
        comments,
        submitUser,
        signout,
        addComment,
        editComment,
        deleteComment,
        addReply,
        handleCommentScore,
      }}
    >
      {children}
    </UserCommentsContext.Provider>
  );
}
