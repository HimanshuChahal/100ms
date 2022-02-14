import { selectPeers, useHMSStore } from "@100mslive/hms-video-react";
import React from "react";
import Peer from "./Peer";
import ChatContainer from '../Chat/ChatContainer'

function Conference() {
    const peers = useHMSStore(selectPeers);
    return (
        <div className="conference-section">
            <h2>Conference</h2>

            <div className="peers-container">
                {peers.map((peer) => (
                    <Peer key={peer.id} peer={ peer } />
                ))}
            </div>

            <ChatContainer/>
        </div>
    );
}

export default Conference;
