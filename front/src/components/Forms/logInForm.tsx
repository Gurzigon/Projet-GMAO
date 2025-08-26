/** biome-ignore-all lint/suspicious/noExplicitAny: <linter capricieux> */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user.service";
import { useAuth } from "../../utils/authContext";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user, token } = await userService.login({ email, password });
      setIsAuthenticated(true);
      navigate("/admin");
      console.log(user, token)
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white ">
      <form onSubmit={handleSubmit} className="flex bg-gray-400 flex-col border border-white border-3 rounded-lg ">
        <fieldset className="fieldset bg-gray-300 border-base-300 rounded-box w-xs p-4 rounded-lg">
          <h1 className="font-bold text-3xl text-center text-black">
            Connexion admin
          </h1>

          <label  htmlFor="email" className="label mt-2">
            <span className="label-text font-bold text-black text-lg">Email</span>
          </label>
          <input
              id="email"
              type="email"
              className="input input-bordered w-full bg-white text-black"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="label mt-2">
            <span className="label-text font-bold text-black text-lg">Password</span>
          </label>
          <input
              id="password"
              type="password"
              className="input input-bordered w-full bg-white text-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-success mt-4 w-full text-white hover:text-success hover:bg-white">Login</button>
      </fieldset>
    </form>
  </div>
  );
}
