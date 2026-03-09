import { useState } from "react";

interface CommentItemProps {
  comment: any;
  currentUser: any;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

export default function CommentItem({
  comment,
  currentUser,
  onDelete,
  onUpdate,
}: CommentItemProps) {
  const [editing, setEditing] =
    useState(false);
  const [content, setContent] =
    useState(comment.content);
  const [menuOpen, setMenuOpen] =
    useState(false);

  const isOwner =
    currentUser &&
    comment.user.id ===
      currentUser.userId;

  return (
    <div className="border p-3 rounded space-y-2">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold">
            {comment.user.email}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(
              comment.createdAt
            ).toLocaleString()}
          </p>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="text-gray-600 text-lg"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                <button
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    onDelete(comment.id);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <>
          <textarea
            className="border p-2 w-full"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                onUpdate(comment.id, content);
                setEditing(false);
              }}
              className="bg-green-600 text-white px-3 py-1"
            >
              Save
            </button>
            <button
              onClick={() =>
                setEditing(false)
              }
              className="bg-gray-500 text-white px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>{comment.content}</p>
      )}
    </div>
  );
}