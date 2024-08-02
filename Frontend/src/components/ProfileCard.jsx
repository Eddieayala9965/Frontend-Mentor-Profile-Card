import React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";

const ProfileCard = ({ user }) => {
  const profile = user.profiles[0];

  return (
    <div className=" w-96 h-full mx-auto p-6 rounded-xl bg-zinc-800 text-white flex flex-col items-center">
      <Avatar
        className="w-24 h-24 rounded-full mb-4"
        src={profile.photo}
        alt="Profile"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150";
        }}
        sx={{ width: 96, height: 96 }}
      />
      <h2 className="text-2xl text-center  font-bold mb-2">{user.username}</h2>
      <div className="flex flex-col gap-5">
        {profile.address && (
          <p className="text-center text-lime-300">{profile.address}</p>
        )}
        <p className="text-center">{profile.bio}</p>
      </div>
      <div className="h-52 flex flex-col justify-center gap-4">
        {profile.social_media_links && profile.social_media_links.length > 0 ? (
          profile.social_media_links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              {link.name}
            </a>
          ))
        ) : (
          <p>No social media links available</p>
        )}
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(
      PropTypes.shape({
        photo: PropTypes.string,
        bio: PropTypes.string,
        social_media_links: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            url: PropTypes.string,
            name: PropTypes.string,
          })
        ),
      })
    ).isRequired,
  }).isRequired,
};

export default ProfileCard;
