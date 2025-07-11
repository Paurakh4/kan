import Avatar from "~/components/Avatar";
import Badge from "~/components/Badge";
import LabelIcon from "~/components/LabelIcon";
import { getAvatarUrl } from "~/utils/helpers";

const Card = ({
  title,
  description,
  labels,
  members,
}: {
  title: string;
  description?: string;
  labels: { name: string; colourCode: string | null }[];
  members: {
    publicId: string;
    email: string;
    user: { name: string | null; email: string; image: string | null } | null;
  }[];
}) => {
  // Helper to strip HTML tags for preview
  function stripHtml(html: string = "") {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  return (
    <div className="flex flex-col rounded-md border border-light-200 bg-light-50 px-3 py-2 text-sm text-neutral-900 dark:border-dark-200 dark:bg-dark-200 dark:text-dark-1000 dark:hover:bg-dark-300">
      <span className="dark:text-white">{title}</span>
      {description && (
        <span
          className="mt-1 text-xs text-neutral-500 dark:text-gray-400 line-clamp-2"
          title={stripHtml(description)}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            minHeight: '2.5em',
          }}
        >
          {stripHtml(description)}
        </span>
      )}
      {labels.length || members.length ? (
        <div className="mt-2 flex flex-col justify-end">
          <div className="space-x-0.5">
            {labels.map((label) => (
              <Badge
                value={label.name}
                iconLeft={<LabelIcon colourCode={label.colourCode} />}
              />
            ))}
          </div>
          <div className="isolate flex justify-end -space-x-1 overflow-hidden">
            {members.map(({ user, email }) => {
              const avatarUrl = user?.image
                ? getAvatarUrl(user.image)
                : undefined;

              return (
                <Avatar
                  name={user?.name ?? ""}
                  email={user?.email ?? email}
                  imageUrl={avatarUrl}
                  size="sm"
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Card;
