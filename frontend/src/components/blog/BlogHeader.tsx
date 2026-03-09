interface BlogHeaderProps {
  title: string;
  authorEmail: string;
  createdAt: string;
}

export default function BlogHeader({
  title,
  authorEmail,
  createdAt,
}: BlogHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>

      <p className="text-sm text-gray-600">
        By {authorEmail}
      </p>

      <p className="text-xs text-gray-500">
        {new Date(createdAt).toLocaleString()}
      </p>

      <hr />
    </div>
  );
}