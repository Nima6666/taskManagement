import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 fixed w-screen top-0 z-50 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">TASKYY</div>
        <nav>
          <ul className="flex space-x-4">
            <li className="bg-gradient-to-r from-orange-400 to-yellow-400 p-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <Link
                to="/login"
                className="text-slate-900 font-semibold text-lg text-center block hover:text-slate-600 transition duration-200"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
