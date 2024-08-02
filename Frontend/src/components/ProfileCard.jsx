import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import AvatarUpload from "./AvatarUpload";

const ProfileCard = ({ user }) => {
  const profile = user.profiles[0];

  return (
    <div className=" xxm:w-4/5 xm:w-2/3 sm:w-2/3 w-full md:w-3/6 mdsm:w-2/5 lgmd:w-1/3 lg:w-2/6 h-auto md:h-[90vh] mx-auto p-6 rounded-xl bg-zinc-900 text-white flex flex-col items-center">
      <AvatarUpload profileId={profile.id} currentPhoto={profile.photo} />
      <h2 className="text-2xl text-center font-bold mb-3">{user.username}</h2>
      <div className="flex flex-col gap-5 w-full">
        {profile.address && (
          <p className="text-center text-lime-300 mb-2">{profile.address}</p>
        )}
        <p className="text-center text-md font-light mb-7">{profile.bio}</p>
      </div>
      <div className="flex flex-col justify-center w-full">
        {profile.social_media_links && profile.social_media_links.length > 0 ? (
          profile.social_media_links.map((link) => (
            <ul
              key={link.id}
              className="mt-6 text-center bg-zinc-800 h-auto w-full max-w-xs lg:max-w-md rounded-lg p-4 mx-auto"
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
        address: PropTypes.string,
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
