import { useState, FormEvent } from "react";
import { Button } from "flowbite-react";
import { useUserComments } from "../context/UserCommentsContext";

type LoginFormProps = {
  onLogin: () => void;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [isInvalidUser, setIsInvalidUser] = useState(false);
  const { users, loginUser } = useUserComments();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!users.find((u) => u.username === username)) {
      setIsInvalidUser(true);
      return;
    }
    setIsInvalidUser(false);
    loginUser(username);
    onLogin();
  }
  return (
    <div className="bg-white rounded-lg py-6 px-10 w-11/12">
      <form onSubmit={handleSubmit}>
        <h3 className="text-center text-lg font-semibold mb-2">Sign in</h3>
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className={`border rounded ${
              isInvalidUser ? "border-red-500" : "border-gray-500"
            }`}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {isInvalidUser && (
          <span className="text-red-500 text-sm mt-2">
            Provided username doesn't exist.
          </span>
        )}
        <Button type="submit" className="ml-auto bg-indigo-600 uppercase">
          Submit
        </Button>
      </form>
    </div>
  );
}
