import { useState } from "react";
import PropTypes from "prop-types";
import { updateSocialMediaLinks } from "../services/api";
import {
  TextField,
  Button,
  Modal,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const UpdateSocialMediaLinksModal = ({ profileId, initialLinks, onClose }) => {
  const [socialMediaLinks, setSocialMediaLinks] = useState(initialLinks);
  const [error, setError] = useState("");

  const handleInputChange = (id, field, value) => {
    setSocialMediaLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const handleUpdateLinks = async () => {
    try {
      await updateSocialMediaLinks(profileId, socialMediaLinks);
      onClose();
    } catch (err) {
      setError("Failed to update social media links. Please try again.");
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box className="p-6 bg-white rounded-md w-full max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Update Social Media Links</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-4">
          {socialMediaLinks.map((link) => (
            <Accordion key={link.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${link.id}-content`}
                id={`panel-${link.id}-header`}
              >
                <Typography>{link.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Name"
                  value={link.name}
                  onChange={(e) =>
                    handleInputChange(link.id, "name", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="URL"
                  value={link.url}
                  onChange={(e) =>
                    handleInputChange(link.id, "url", e.target.value)
                  }
                  fullWidth
                />
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            onClick={handleUpdateLinks}
            className="bg-blue-500 text-white mt-4"
          >
            Update
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

UpdateSocialMediaLinksModal.propTypes = {
  profileId: PropTypes.string.isRequired,
  initialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateSocialMediaLinksModal;
