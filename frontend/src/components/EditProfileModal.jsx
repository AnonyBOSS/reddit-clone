import { useState } from "react";
import api from "../api/axios";

export default function EditProfileModal({ profile, onClose, onUpdated }) {
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    try {
      await api.patch("/users/me", { displayName, bio });
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    try {
      setUploading(true);
      await api.post("/users/upload-avatar", form);
      onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-reddit-dark_card p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        {/* Avatar upload */}
        <label className="block text-sm font-medium mb-1">Avatar</label>
        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        {uploading && <p className="text-xs mt-1">Uploading...</p>}

        {/* Display Name */}
        <label className="block text-sm font-medium mt-4">Display Name</label>
        <input
          className="w-full border rounded px-2 py-1"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        {/* Bio */}
        <label className="block text-sm font-medium mt-4">Bio</label>
        <textarea
          className="w-full border rounded px-2 py-1 h-20 resize-none"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 rounded-full bg-gray-300" onClick={onClose}>
            Cancel
          </button>
          <button className="px-3 py-1 rounded-full bg-reddit-blue text-white" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
