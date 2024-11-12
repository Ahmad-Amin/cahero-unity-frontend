import React from 'react'
import { Box } from '@mui/material'
import Subscriptions from '../../components/Admin Components/Subscriptions';
import { Link } from 'react-router-dom';

const Subscription = () => {
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
        <div className="p-5">
        <div className="flex flex-row items-center gap-6">
          <h1 className="flex-1 text-3xl font-semibold text-white py-8">
            Manage Subscription plans
          </h1>
          <Link to="/dashboard/subscription/create-new-plan">
            <button className="w-44 h-12 hover:bg-[#5242b6] bg-[#6a55ea] text-white text-lg font-semibold rounded-lg ease-in-out transition duration-300">
              Create New
            </button>
          </Link>
          </div>
          <p className="font-normal text-base text-white opacity-60">Edit or create new subscription plan for user to enjoy exclusive content.</p>
          </div>
       <div>
        <Subscriptions/>
       </div>
      </Box>
    </>
  )
}

export default Subscription
