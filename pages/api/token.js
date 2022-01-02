import axios from 'axios'

const uuid4 = require('uuid4')

export default async function token(req, res) {

    try
    {

        // const response = await fetch(`https://prod-in.100ms.live/hmsapi/hyperfit.app.100ms.live/api/token`, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         user_id: uuid4(),
        //         room_id: '61cdc2c28d6d5fd351cbd711',
        //         role: 'trainer',
        //     }),
        // })

        const response = await axios.post('https://prod-in.100ms.live/hmsapi/hyperfit.app.100ms.live/api/token', {
            user_id: uuid4(),
            room_id: '61cdc2c28d6d5fd351cbd711',
            role: 'trainer',
        })

        const { token } = await response.data

        res.status(200).json({ token })

    } catch(e)
    {
        console.log('token', e)
        res.status(500)
    }

}
