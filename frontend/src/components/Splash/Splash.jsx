// frontend/src/components/Splash/Splash.jsx

import "./Splash.css"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Splash = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const nav = useNavigate()

  const handleWeightsBtn = () => { nav("/weights") }
  const handleWorkoutsBtn = () => { nav("/workouts") }
  const handleGrubsBtn = () => { nav("/grubs") }

  useEffect(() => {
    if (sessionUser) {
      console.log("Session user loaded:", sessionUser);
    }
  }, [sessionUser]);

  return (
    <div>
      {sessionUser ? (
        <>
          <h3 className="splash_showEmail">Email = {sessionUser?.email}</h3>
          <div className="splash_grid">
            <button className="splashButton green" onClick={handleWeightsBtn}>weights</button>
            <button className="splashButton orange" onClick={handleWorkoutsBtn}>workouts</button>
            <button className="splashButton blue" onClick={handleGrubsBtn}>grubs</button>
          </div>
        </>
      ) : (
        <h3>Please login to access the app</h3>
      )}
    </div>
  );
};

export default Splash;
