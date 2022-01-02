import { useState } from "react";
import { useHMSActions } from "@100mslive/hms-video-react";
import axios from "axios";

function JoinForm() {
    const hmsActions = useHMSActions();
    const [inputValues, setInputValues] = useState({
        name: "",
        token: ""
    });

    const handleInputChange = (e) => {
        setInputValues((prevValues) => ({
        ...prevValues,
        [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const response = await fetch(`https://prod-in.100ms.live/hmsapi/hyperfit.app.100ms.live/api/token`, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         user_id: `${ Math.random() }`,
        //         room_id: '61cdc2c28d6d5fd351cbd711',
        //         role: 'trainer'
        //     }),
        // });
        // const { token } = await response.json();
        const response = await axios.get('http://localhost:3000/api/token')

        hmsActions.join({
            userName: inputValues.name,
            authToken: response.data.token
        });
    };

    return (
        <form className = 'card' onSubmit={handleSubmit}>
        <h2>Join Room</h2>
        <div className="input-container">
            <input
            value={inputValues.name}
            onChange={handleInputChange}
            id="name"
            type="text"
            name="name"
            placeholder="Your name"
            />
        </div>
        <button className="btn-primary">Join</button>
        </form>
    );
}

export default JoinForm;
