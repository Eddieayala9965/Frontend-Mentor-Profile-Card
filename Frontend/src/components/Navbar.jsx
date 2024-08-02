import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="container mx-auto rounded-full h-14 bg-zinc-900 flex flex-col mt-3 px-4 lgmd:w-3/4 mdsm:w-3/4 sm:w-2/3 xm:w-3/5 xxm:w-3/4">
      <div className="mx-auto flex flex-wrap justify-center space-x-4">
        <Link to="/profile" className="text-white p-2 md:p-4">
          Profile
        </Link>
        <Link to="/signup" className="text-white p-2 md:p-4">
          Sign Up
        </Link>
        <Link to="/login" className="text-white p-2 md:p-4">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
