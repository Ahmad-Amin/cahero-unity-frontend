import React, { useEffect, useState } from 'react';
import axiosInstance from "../../lib/axiosInstance";
import { HashLoader } from "react-spinners";

const UsersTable = ({ onViewUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      setUsers(response.data.results);
      console.log("Fetched users:", response.data.results);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users initially
  }, []);

  const getUserTypeColor = (role) => {
    switch (role.toLowerCase()) {
      case 'host':
        return '#FFEA00';
      case 'admin':
        return '#46d133';
      case 'participant':
        return '#6a55ea';
      default:
        return 'white';
    }
  };

  if (error) {
    return <div className="font-semibold text-xl text-white">{error}</div>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md ml-10">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <HashLoader color="#6A55EA" loading={loading} size={40} />
        </div>
      ) : (
        <table className="w-full text-base text-left rtl:text-right text-white">
          <thead className="text-lg text-white uppercase bg-transparent">
            <tr>
              <th scope="col" className="px-6 py-3">#</th>
              <th scope="col" className="px-6 py-3">Full Name</th>
              <th scope="col" className="px-6 py-3">User Type</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="bg-transparent border-b border-[#878788]">
                <td className="px-6 py-4">{index + 1}</td>
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {user.firstName}&nbsp;{user.LastName}
                </th>
                <td className="px-6 py-4" style={{ color: getUserTypeColor(user.role) }}>
                  {user.role}
                </td>
                <td className="px-6 py-4">{user.phoneNumber}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">Active</td>
                <td className="px-6 py-4">
                  <button
                    className="font-medium text-white bg-[#6a55ea] hover:bg-[#5242b6] rounded-lg h-8 w-auto px-5 ease-in-out transition duration-200"
                    onClick={() => onViewUser(user)} // Pass the user to the modal
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersTable;
