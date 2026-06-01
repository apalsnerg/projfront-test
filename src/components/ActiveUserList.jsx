import { useContext } from "react";
import { ActiveUserContext } from "../contexts/ActiveUserContext";
import { getCurrentUserEmail } from "../models/token";

export default function ActiveUserList({ projectUsers }) {
  const { activeUsers } = useContext(ActiveUserContext);
  const currentEmail = getCurrentUserEmail();

  const active = projectUsers.filter(
    (user) => activeUsers[user.email] || user.email === currentEmail,
  );

  const inactive = projectUsers.filter(
    (user) => !activeUsers[user.email] && user.email !== currentEmail,
  );

  return (
    <div
      className="
        w-full
        border
        border-[var(--border-color)]
        rounded-xl
        p-4
        bg-gray-900/40
        overflow-y-auto
        overflow-x-hidden
      "
    >
      <h2
        className="
          text-gray-300
          text-base
          font-semibold
          mb-3
        "
      >
        Project members
      </h2>

      <h3
        className="
          text-sm
          font-semibold
          mb-2
          text-cyan-300
        "
      >
        Active
      </h3>

      {active.length === 0 ? (
        <p
          className="
            text-xs
            text-gray-400
            mb-4
          "
        >
          No active users
        </p>
      ) : (
        active.map((user) => (
          <div
            key={user.email}
            className="
                border-b
                border-[var(--border-color)]
                pb-2
                mb-2
              "
          >
            <div
              className="
                  flex
                  gap-2
                  items-start
                "
            >
              <div
                className="
                    w-2
                    h-2
                    min-w-2
                    rounded-full
                    mt-2
                  "
                style={{
                  backgroundColor: activeUsers[user.email]?.color,
                }}
              />

              <div
                className="
                    min-w-0
                    flex-1
                  "
              >
                <span
                  className="
                      text-sm
                      block
                      truncate
                    "
                  title={user.email}
                >
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      <h3
        className="
          text-sm
          font-semibold
          mt-4
          mb-2
          text-gray-400
        "
      >
        Inactive
      </h3>

      {inactive.length === 0 ? (
        <p
          className="
            text-xs
            text-gray-400
          "
        >
          No inactive users
        </p>
      ) : (
        inactive.map((user) => (
          <div
            key={user.email}
            className="
                flex
                items-center
                gap-2
                text-gray-400
                mb-2
              "
          >
            <div
              className="
                  w-2
                  h-2
                  rounded-full
                  bg-gray-500
                "
            />

            <span
              className="
                  truncate
                "
              title={user.email}
            >
              {user.email}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
