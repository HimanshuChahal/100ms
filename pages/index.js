import JoinForm from "../components/JoinForm";
import Conference from "../components/Conference";
import { useEffect } from "react";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from "@100mslive/hms-video-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  return (
    <div className="container">
      <Header />
      {isConnected ? (
        <>
          <Conference />
          <Footer/>
        </>
      ) : (
        <JoinForm />
      )}
    </div>
  );
}
