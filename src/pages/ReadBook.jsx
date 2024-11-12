import React from "react";
import { Box } from "@mui/material";
import LoginedNavbar from "../components/LoginedNavbar";
import { Link, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md"; // Importing the left arrow icon from React Icons
import { useSelector } from 'react-redux';
import Navbar from "../components/Navbar";
const drawerWidth = 280;

const SubscriptionPlans = () => {
  const {id: bookId} = useParams()
  const currentUser = useSelector((state) => state.auth.user); 

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#131213",
          minHeight: "100vh",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "70px",
            height: "100%",
            background:
              "linear-gradient(to right, #220e37 0%, rgba(34, 14, 55, 0) 100%)",
            zIndex: 1,
          }}
        />
              {currentUser ? <LoginedNavbar  /> : <Navbar />}


        <div>
          <div
            style={{ zIndex: 2 }}
            className="mx-4 md:mx-8 mt-10 text-white text-xl font-semibold"
          >
            <Link to={`/all-books/${bookId}`} >
            <button
              className="relative flex items-center bg-transparent text-white opacity-75 hover:opacity-100 text-lg font-semibold z-10"
            >
              <MdArrowBack className="mr-2" />
              BACK
            </button>
            </Link>
          </div>
        </div>
        <div className="text-white mx-8 md:mx-16 mt-12 text-xl font-semibold">
          <h1>Harry Potter and the Sorcer...</h1>
        </div>
        <div className="text-white mx-8 md:mx-16 mt-3 opacity-80 ">
          <p style={{ marginBottom: "1rem" }}>
            After murdering Harry's parents, James and Lily Potter, evil Lord
            Voldemort puts a killing curse on Harry, then just a baby. The curse
            inexplicably reverses, defeating Voldemort and searing a
            lightning-bolt scar in the middle of the infant's forehead. Harry is
            then left at the doorstep of his boring but brutish aunt and uncle,
            the Dursleys.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            For 10 years, Harry lives in the cupboard under the stairs and is subjected to cruel mistreatment by Aunt Petunia, Uncle Vernon, and their son Dudley. On his 11th birthday, Harry receives a letter inviting him to study magic at the Hogwarts School of Witchcraft and Wizardry. Harry discovers that not only is he a wizard, but he is a famous one.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            He meets two best friends, Ron Weasley and Hermione Granger, and makes his first enemy, Draco Malfoy. At Hogwarts, the three friends are all placed into the Gryffindor house. Harry has a knack for the school sport, Quidditch, and is recruited onto the Gryffindor team as its star Seeker.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            Perusing the restricted section in the library, Harry discovers that the Sorcerer's Stone produces the Elixir of Life, which gives its drinker the gift of immortality. After realizing that Voldemort might be after the stone, Albus Dumbledore had it moved to Hogwarts for safekeeping.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            Harry finds out that when she died, Lily Potter transferred to her son an ancient magical protection from Voldemort's lethal spells. This protection is what allowed Harry as an infant to survive Voldemort's attack. It also helps Harry keep Voldemort from possessing the Stone, which Dumbledore agrees to destroy.
          </p>
        </div>
      </Box>
    </>
  );
};

export default SubscriptionPlans;
