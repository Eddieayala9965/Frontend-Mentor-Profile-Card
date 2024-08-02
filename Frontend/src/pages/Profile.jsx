import { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";
import { getUser } from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleProfileCreated = () => {
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black flex justify-center items-center flex-col gap-5 mt-5">
      {user && user.profiles && user.profiles.length > 0 ? (
        <ProfileCard user={user} />
      ) : (
        <ProfileForm onProfileCreated={handleProfileCreated} />
      )}
    </div>
  );
};

export default Profile;
