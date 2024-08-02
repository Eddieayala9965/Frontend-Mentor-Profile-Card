import React, { useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import { uploadProfilePicture } from "../services/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AvatarUpload = ({ profileId, currentPhoto }) => {
  const [photo, setPhoto] = useState(currentPhoto);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await uploadProfilePicture(profileId, file);
        if (response.status === 200) {
          setPhoto(response.data.photo);
        }
      } catch (err) {
        console.error("Failed to upload file:", err);
      }
    }
  };

  return (
    <div className="relative">
      <Avatar
        className="w-24 h-24 rounded-full mb-4 cursor-pointer"
        src={photo}
        alt="Profile"
        onClick={() => document.getElementById("file-input").click()}
        sx={{ width: 96, height: 96 }}
      />
      <input
        type="file"
        id="file-input"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};

export default AvatarUpload;
