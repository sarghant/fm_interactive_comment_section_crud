import { useState } from "react";
import { CommentsLayout } from "./components/CommentsLayout";
import { useUserComments } from "./context/UserCommentsContext";
import { CommentForm } from "./components/CommentForm";
import { SignupForm } from "./components/SignupForm";
import { CiLogout, CiLogin } from "react-icons/ci";
import { LoginForm } from "./components/LoginForm";

function App() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { currentUser, signout, comments } = useUserComments();
  return (
    <>
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-2/5 px-4 md:px-0 mx-auto mt-11">
        {comments.length > 0 && <CommentsLayout />}
        {currentUser && <CommentForm />}
        {!currentUser && !isLoggingIn && <SignupForm />}
        {!currentUser && isLoggingIn && (
          <LoginForm onLogin={() => setIsLoggingIn(false)} />
        )}
      </div>
      <button
        onClick={currentUser ? signout : () => setIsLoggingIn(true)}
        className="absolute top-4 right-4 flex gap-2 items-center rounded-lg py-2 px-3 hover:bg-gray-300 hover:bg-opacity-15 transition-colors"
      >
        <span className="text-gray-600">
          {currentUser ? "Sign out" : "Sign in"}
        </span>
        {currentUser ? <CiLogout size="28" /> : <CiLogin size="28" />}
      </button>
    </>
  );
}

export default App;
