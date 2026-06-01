import { useEffect, useState } from "react";
import { getCurrentUserEmail } from "../models/token";
import { updatePassword } from "../models/auth";
import { validatePassword } from "../utils/passwordValidation";
import { saveProfile, getProfile } from "../services/profileService";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ProfileView() {
  const email = getCurrentUserEmail();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [nameMessage, setNameMessage] = useState("");

  const breadcrumbItems = [
    {
      label: "Dashboard",
      path: "/",
    },
    {
      label: "Profile",
    },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        if (profile.length > 0) {
          const savedData = JSON.parse(profile[0].artefact);

          setDisplayName(savedData.displayName || "");
        }
      } catch {
        setNameMessage("Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  const handleSaveDisplayName = async () => {
    if (!newDisplayName.trim()) {
      setNameMessage("Display name cannot be empty");

      return;
    }

    try {
      await saveProfile({
        displayName: newDisplayName,
      });

      setDisplayName(newDisplayName);

      setNewDisplayName("");

      setNameMessage("Display name updated successfully");
    } catch {
      setNameMessage("Failed to update display name");
    }
  };

  const handlePasswordChange = async () => {
    const passwordErrors = validatePassword(password);

    if (passwordErrors.length > 0) {
      setMessage(passwordErrors[0]);

      return;
    }

    try {
      await updatePassword(email, password);

      setMessage("Password updated successfully");

      setPassword("");
    } catch {
      setMessage("Failed to update password");
    }
  };

  return (
    <div className="bg-main min-h-screen text flex flex-col items-center mt-10">
      <div className="w-full max-w-xl px-4">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="border rounded p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-400">Email</p>

            <p className="text-lg">{email}</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text font-medium mb-2">Display name</h2>

            <p
              className="
                text-sm
                italic
                mb-6
                mt-2
                text-gray-400
              "
            >
              {displayName || "No display name set"}
            </p>

            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => {
                setNewDisplayName(e.target.value);
                setNameMessage("");
              }}
              placeholder="Enter new display name"
              className="input-field mb-4"
            />

            <button
              className="button button-cyan"
              type="button"
              onClick={handleSaveDisplayName}
            >
              Save display name
            </button>

            {nameMessage && <p className="text-sm mt-2">{nameMessage}</p>}
          </div>

          <div className="border-t pt-6">
            <h2 className="text font-medium mb-4">Change password</h2>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
              placeholder="New password"
              className="input-field mb-4"
            />

            <button
              className="button button-cyan"
              type="button"
              onClick={handlePasswordChange}
            >
              Update password
            </button>

            {message && <p className="text-sm mt-2">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
