import { useState } from "react";
import PropTypes from "prop-types";
import { updateProfile } from "../services/api";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";

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
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Update Profile
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
          multiline
          sx={{ mb: 2 }}
        />
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleUpdateProfile}
          variant="contained"
          color="primary"
        >
          Update
        </Button>
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
