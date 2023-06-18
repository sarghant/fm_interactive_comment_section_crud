import { CommentsLayout } from "./components/CommentsLayout";
import { useUserComments } from "./context/UserCommentsContext";
import { CommentForm } from "./components/CommentForm";
import { SignupForm } from "./components/SignupForm";
import { CiLogout } from "react-icons/ci";

function App() {
  const { currentUser, signout, comments } = useUserComments();
  return (
    <>
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-2/5 px-4 md:px-0 mx-auto mt-11">
        {comments.length > 0 && <CommentsLayout />}
        {currentUser ? <CommentForm /> : <SignupForm />}
      </div>
      {currentUser && (
        <button
          onClick={signout}
          className="absolute top-4 right-4 flex gap-2 items-center rounded-lg py-2 px-3 hover:bg-gray-300 hover:bg-opacity-15 transition-colors"
        >
          <span className="text-gray-600">Sign out</span>
          <CiLogout size="28" />
        </button>
      )}
    </>
  );
}

export default App;
