import { FormEvent, useState, useRef } from "react";
import { Button } from "flowbite-react";
import { retrieveFilename } from "../helpers/retrieveFilename";
import { useUserComments } from "../context/UserCommentsContext";

export function SignupForm() {
  const [username, setUsername] = useState("");
  const [filepath, setFilepath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { submitUser } = useUserComments();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submitUser({
      image: {
        png: filepath,
      },
      username,
    });
  }
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    fileInputRef.current?.click();
  }
  function handleFileChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const imgName = target.files[0].name;
      setFilepath(`images/avatars/${imgName}`);
    }
  }
  return (
    <div className="bg-white rounded-lg py-6 px-10 w-11/12">
      <form onSubmit={handleSubmit}>
        <h3 className="text-center text-lg font-semibold mb-2">Sign up</h3>
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="rounded border border-gray-500"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center mb-6">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <span className="text-sm gray-500">
            {filepath ? retrieveFilename(filepath) : "No image chosen."}
          </span>
          <Button
            onClick={handleClick}
            className="text-sm font-normal bg-gray-500"
          >
            Choose Image
          </Button>
        </div>
        <Button type="submit" className="ml-auto bg-indigo-600 uppercase">
          Submit
        </Button>
      </form>
    </div>
  );
}
