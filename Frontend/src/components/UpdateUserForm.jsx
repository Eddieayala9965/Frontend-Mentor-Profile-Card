import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button } from "@mui/material";
import { updateUser } from "../services/api";

const UpdateUserForm = ({ userId, onClose }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userId, { username });
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Update Username
      </Button>
    </form>
  );
};

UpdateUserForm.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateUserForm;
