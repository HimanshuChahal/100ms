import React from 'react'
import '../styles/globals.css'
import { HMSRoomProvider } from '@100mslive/hms-video-react'

function MyApp({ Component, pageProps }) {
  return (
    <HMSRoomProvider>

      <Component {...pageProps} />
      
    </HMSRoomProvider>
  )
}

export default MyApp
