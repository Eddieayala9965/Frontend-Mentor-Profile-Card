import React, { useState } from "react";
import PropTypes from "prop-types";
import { updateProfile } from "../services/api";
import { TextField, Button, Modal, Box } from "@mui/material";

const UpdateProfileModal = ({
  profileId,
  bio: initialBio,
  address: initialAddress,
  onClose,
}) => {
  const [bio, setBio] = useState(initialBio);
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState("");

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profileId, { bio, address });
      onClose();
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box className="p-6 bg-white rounded-md">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-4">
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
            multiline
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
          <Button
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white"
          >
            Update
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

UpdateProfileModal.propTypes = {
  profileId: PropTypes.string.isRequired,
  bio: PropTypes.string,
  address: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default UpdateProfileModal;
