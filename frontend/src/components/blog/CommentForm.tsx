interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CommentForm({
  value,
  onChange,
  onSubmit,
}: CommentFormProps) {
  return (
    <div className="space-y-2">
      <textarea
        className="border p-2 w-full"
        placeholder="Write a comment..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Post Comment
      </button>
    </div>
  );
}