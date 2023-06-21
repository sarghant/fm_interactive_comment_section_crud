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
  users: User[];
  comments: Comment[];
  submitUser: (user: User) => void;
  loginUser: (username: string) => void;
  signout: () => void;
  addComment: (comment: Comment) => void;
  editComment: (id: string, content: string, replyId?: string) => void;
  deleteComment: (id: string, replyId?: string) => void;
  addReply: (id: string, commentReply: Comment) => void;
  handleCommentScore: (id: string, vote: string, replyId?: string) => void;
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
  const [users, setUsers] = useLocalStorage<User[]>("USERS", []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>(
    "CURRENT USER",
    null
  );
  function submitUser(user: User) {
    setUsers((u) => [...u, user]);
    setCurrentUser(user);
  }
  function loginUser(username: string) {
    setCurrentUser(users.find((u) => u.username === username)!);
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
  function handleCommentScore(
    id: string,
    vote: string,
    replyId: string | undefined
  ) {
    setComments((c) =>
      c.map((comment) => {
        if (comment.id === id && !replyId) {
          return {
            ...comment,
            score: vote === "downvote" ? comment.score-- : comment.score++,
          };
        }
        if (replyId) {
          const updatedReplies = comment.replies!.map((reply) => {
            if (reply.id === replyId) {
              return {
                ...reply,
                score: vote === "downvote" ? reply.score-- : reply.score++,
              };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      })
    );
  }
  return (
    <UserCommentsContext.Provider
      value={{
        currentUser,
        users,
        comments,
        submitUser,
        loginUser,
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
