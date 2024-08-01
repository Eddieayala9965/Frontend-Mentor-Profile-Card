import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className=" container rounded-full h-10  bg-zinc-600 flex flex-col mt-3">
      <div className=" my-auto mx-auto flex">
        <ul>
          <Link to="/" className="text-white p-4">
            Home
          </Link>
          <Link to="/signup" className="text-white p-4">
            Sign Up
          </Link>
          <Link to="/login" className="text-white p-4">
            Login
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
