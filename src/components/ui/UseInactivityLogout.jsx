import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Slice/AuthSlice"; 

const useInactivityLogout = (inactivityLimit = 600000) => { // default to 10 minutes
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleSessionExpired();
    }, inactivityLimit);
  };

  const handleSessionExpired = () => {
    // You could add a session-expired API call here if needed
    dispatch(logout()); 
  };

  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    activityEvents.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    // Start the initial timer
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return null;
};

export default useInactivityLogout;
