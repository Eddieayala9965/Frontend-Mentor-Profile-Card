import { useState } from "react";
import PropTypes from "prop-types";
import { updateUser } from "../services/api";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";

const UpdateUserModal = ({ userId, initialUsername, onClose }) => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUpdateUser = async () => {
    try {
      await updateUser(userId, { username, password });
      onClose();
    } catch (err) {
      setError("Failed to update user. Please try again.");
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
          Update User
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button onClick={handleUpdateUser} variant="contained" color="primary">
          Update
        </Button>
      </Box>
    </Modal>
  );
};

UpdateUserModal.propTypes = {
  userId: PropTypes.string.isRequired,
  initialUsername: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateUserModal;
