import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import { getUser } from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <ProfileCard user={user} />
    </div>
  );
};

export default Profile;
