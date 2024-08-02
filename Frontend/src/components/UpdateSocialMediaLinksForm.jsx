import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { updateSocialMediaLinks } from "../services/api";

const UpdateSocialMediaLinksForm = ({ profileId, open, onClose }) => {
  const [links, setLinks] = useState([{ id: "", name: "", url: "" }]);

  const handleChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, { id: "", name: "", url: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSocialMediaLinks(profileId, links);
      onClose();
    } catch (error) {
      console.error("Error updating social media links:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Social Media Links</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <TextField
                label="Name"
                type="text"
                value={link.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                fullWidth
              />
              <TextField
                label="URL"
                type="url"
                value={link.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
                fullWidth
              />
            </div>
          ))}
          <Button onClick={handleAddLink} color="primary">
            Add Link
          </Button>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

UpdateSocialMediaLinksForm.propTypes = {
  profileId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateSocialMediaLinksForm;
