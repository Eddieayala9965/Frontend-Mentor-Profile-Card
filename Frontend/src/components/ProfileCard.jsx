import React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";

const ProfileCard = ({ user }) => {
  const profile = user.profiles[0];

  return (
    <div className=" w-2/6 h-[90vh] mx-auto p-6 rounded-xl bg-zinc-900 text-white flex flex-col items-center">
      <Avatar
        className="w-24 h-24 rounded-full mb-6 mt-4"
        src={profile.photo}
        alt="Profile"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150";
        }}
        sx={{ width: 96, height: 96 }}
      />
      <h2 className="text-2xl text-center  font-bold mb-3">{user.username}</h2>
      <div className="flex flex-col gap-5">
        {profile.address && (
          <p className="text-center text-lime-300 mb-2">{profile.address}</p>
        )}
        <p className="text-center text-md font-light mb-7">{profile.bio}</p>
      </div>
      <div className="h-64 flex flex-col justify-center mt-14">
        {profile.social_media_links && profile.social_media_links.length > 0 ? (
          profile.social_media_links.map((link) => (
            <ul
              key={link.id}
              className="mt-6 text-center bg-zinc-800 h-44 w-96 rounded-lg p-4"
            >
              <li className="flex flex-col gap-4">
                <a href={link.url} className="text-white font-bold">
                  {link.name}
                </a>
              </li>
            </ul>
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
