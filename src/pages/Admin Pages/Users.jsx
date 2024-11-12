import React, { useState } from 'react';
import { Box } from '@mui/material';
import UsersTable from '../../components/Admin Components/UsersTable';
import UserManagement from '../../components/Admin Components/UserManagement'; // Import the modal component

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#101011",
          minHeight: "100vh",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="pb-10">
          <div className="flex flex-row items-center gap-6 ">
            <h1 className="flex-1 text-3xl font-semibold text-white pt-8 pb-5">
              User Management
            </h1>
            <div className="flex items-center mx-5">
              <label htmlFor="sort" className="text-white text-lg font-semibold mr-2">
                Sort
              </label>
              <select
                id="sort"
                name="sort"
                className="bg-transparent text-white p-2 rounded-lg border h-12 border-[#585858]"
              >
                <option className="bg-[#101011] text-white" value="finance">Admin</option>
                <option className="bg-[#101011] text-white" value="technology">User</option>
                <option className="bg-[#101011] text-white" value="health">Participant</option>
                <option className="bg-[#101011] text-white" value="education">All</option>
              </select>
            </div>
          </div>
          <p className="font-normal text-base text-white opacity-60">Manage Admins, Hosts, and Participants</p>
        </div>
        <div>  
          <UsersTable onViewUser={handleViewUser} /> {/* Pass the handler to UsersTable */}
        </div>
        
        <UserManagement 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onConfirm={() => {}} // Add your confirmation logic here if needed
          itemType={selectedUser} 
        /> {/* Modal for user management */}
      </Box>
    </>
  );
};

export default Users;
