import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { createProfile } from "../services/api";

const ProfileForm = ({ onProfileCreated }) => {
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState([
    { name: "", url: "" },
  ]);

  const handleSocialMediaChange = (index, field, value) => {
    const newLinks = [...socialMediaLinks];
    newLinks[index][field] = value;
    setSocialMediaLinks(newLinks);
  };

  const handleAddLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { name: "", url: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProfile({
        bio,
        address,
        social_media_links: socialMediaLinks,
      });
      onProfileCreated();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TextField
        label="Bio"
        type="text"
        name="bio"
        value={bio}
        required
        fullWidth
        onChange={(e) => setBio(e.target.value)}
        sx={{ backgroundColor: "white", borderRadius: 1 }}
      />
      <TextField
        label="Address"
        type="text"
        name="address"
        value={address}
        required
        fullWidth
        onChange={(e) => setAddress(e.target.value)}
        sx={{ backgroundColor: "white", borderRadius: 1 }}
      />
      {socialMediaLinks.map((link, index) => (
        <div key={index}>
          <TextField
            label="Social Media Name"
            type="text"
            name="name"
            value={link.name}
            required
            fullWidth
            onChange={(e) =>
              handleSocialMediaChange(index, "name", e.target.value)
            }
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Social Media URL"
            type="url"
            name="url"
            value={link.url}
            required
            fullWidth
            onChange={(e) =>
              handleSocialMediaChange(index, "url", e.target.value)
            }
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
        </div>
      ))}
      <Button type="button" onClick={handleAddLink}>
        Add Social Media Link
      </Button>
      <Button type="submit">Create Profile</Button>
    </form>
  );
};

export default ProfileForm;
