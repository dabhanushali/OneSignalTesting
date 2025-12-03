import { useEffect, useState } from "react";
import "./App.css";
import OneSignal from "react-onesignal";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    OneSignal.init({
      appId: "b2213963-8918-4453-81ce-4d2ec04fe468",
      notifyButton: { enable: true },
    });
  }, []);

  const sendNotification = async () => {
    const baseUrl = (import.meta.env.VITE_BACKEND_URL || 'https://one-signal-testing-lp2l.vercel.app').replace(/\/$/, '');
    // If running against a local Express backend (localhost) use the root path
    // otherwise call the Vercel serverless function under /api
    const isLocal = /localhost|127\.0\.0\.1/.test(baseUrl);
    const endpoint = isLocal ? '/send-notification' : '/api/send-notification';

    await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
    });
    // alert("Notification triggered!");
  };

  useEffect(() => {
    if (count === 5) {
      sendNotification();
    }
  }, [count]);

  // const handleClick = async () => {
  //   const res = await fetch("http://localhost:4000/send-email", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email: "dabhanushali@enacton.email" }),
  //   });
  //   const data = await res.json();
  //   console.log(data);
  //   alert("Email triggered via OneSignal!");
  // };

  return (
    <>
      <h1>Welcome to OneSignal Test</h1>
      <div className="first-div">
        <h2>Click the below button to receive the notification right now</h2>
        <button onClick={sendNotification}>Send Notification</button>
      </div>

      {/* <div className="second-div">
        <h2>Increment this counter to 5 to receive the notification</h2>
        <h3>Counter: {count}</h3>
        <button onClick={() => setCount(0)}>Reset the Counter</button>
        <button onClick={() => setCount((prevCount) => prevCount + 1)}>
          Increment Counter
        </button>
      </div> */}

      {/* <div>
        <h2>Click the below button to receive the email right now</h2>
        <button onClick={handleClick}>Send Email via OneSignal</button>
      </div> */}
    </>
  );
}

export default App;
