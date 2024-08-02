import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className=" container rounded-full h-14 bg-zinc-900 flex flex-col mt-3 ">
      <div className=" mx-auto flex">
        <Link to="/profile" className="text-white p-4">
          Profile
        </Link>
        <Link to="/signup" className="text-white p-4">
          Sign Up
        </Link>
        <Link to="/login" className="text-white p-4">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
