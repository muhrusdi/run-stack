import { Link, Outlet } from "@remix-run/react";

const Movies = () => {
  return (
    <div>
      <Link to="/">Back</Link>
      <h1>List of movie</h1>

      <Outlet />
    </div>
  );
};

export default Movies;
