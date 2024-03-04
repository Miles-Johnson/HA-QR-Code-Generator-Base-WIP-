"use client";

import { LinkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";

export function EditProfileForm() {
  const { data: user } = trpc.users.get.useQuery();
  const { mutateAsync: updateUsername } =
    trpc.users.updateUsername.useMutation();
  const [username, setUsername] = useState("");

  const onSave = useCallback(async () => {
    if (!username) return;
    const updatedUser = await updateUsername({ username }).catch((err) => {
      toast.error("could not update username");
      return null;
    });
    if (!updatedUser || updatedUser.username !== username) {
      return toast.error("could not update username");
    }

    if (updatedUser.username === username)
      toast.success("username updated to " + username);
    setUsername(updatedUser.username);
  }, [username]);

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-base-200 rounded-lg p-12 pb-6">
      <div className="grid gap-4 gap-y-4 grid-cols-2">
        <div className="">
          <label
            htmlFor="text"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Username
          </label>
          <div className="">
            <input
              type="text"
              name="username"
              id="text"
              className="input input-bordered w-full"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div></div>
        <div className="w-full flex col-span-2 mt-10">
          <div className="ml-auto flex flex-row gap-3">
            <Link
              href={`/users/${user.username}`}
              className={cn(
                "btn rounded-full font-bold text-lg",
                user?.username ? "" : "hidden"
              )}
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              View Profile
            </Link>
            <button
              disabled={!user}
              onClick={onSave}
              className={cn(
                "btn btn-neutral rounded-full font-bold text-lg",
                !user && "btn-disabled"
              )}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
