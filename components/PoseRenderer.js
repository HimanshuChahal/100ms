import React, { useRef, useEffect, useState } from 'react'
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks } from "@mediapipe/drawing_utils";

const connections = [[0,1],[0,4],[1,2],[2,3],[3,7],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[11,23],[12,14],[14,16],[12,24],[13,15],[15,17],[16,18],
[16,20],[15,17],[15,19],[15,21],[16,22],[17,19],[18,20],[23,25],[23,24],[24,26],[25,27],[26,28],[27,29],[28,30],[27,31],[28,32],[29,31],[30,32]]

const connectorColor = 'white'

export default () => {

    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    const [ dimens, setDimens ] = useState({})

    useEffect(() => {

        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            },
        })
        
        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            selfieMode: true
        });

        pose.onResults(onResults)
        
        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                await pose.send({ image: videoRef.current });
            },
            width: 1280,
            height: 720,
        });
        camera.start();

        setDimens({
            width: window.innerWidth,
            height: window.innerHeight
        })

    }, [])

    function onResults(results) {

        const canvasCtx = canvasRef.current.getContext('2d')
        canvasCtx.save();
        canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
        canvasCtx.globalCompositeOperation = "source-in";
        canvasCtx.fillStyle = "#00FF00";
        canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = "destination-atop";
        canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
        );

        canvasCtx.globalCompositeOperation = "source-over";
        
        // Draw connectors implementation

        canvasCtx.fillStyle = connectorColor;
        canvasCtx.strokeStyle = connectorColor;
        canvasCtx.lineWidth = window.innerWidth >= 768 ? 10 : 4;

        connections.forEach(([i, j]) => {

            const kp1 = results.poseLandmarks[i];
            const kp2 = results.poseLandmarks[j];
            // If score is null, just show the keypoint.
            const score1 = kp1.visibility != null ? kp1.visibility : 1;
            const score2 = kp2.visibility != null ? kp2.visibility : 1;
            const scoreThreshold = 0;

            if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(kp1.x*1280, kp1.y*720);
            canvasCtx.lineTo(kp2.x*1280, kp2.y*720);
            canvasCtx.stroke();
            }
        });

        // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        //   color: connectorColor,
        //   lineWidth: window.innerWidth >= 768 ? 10 : 4,
        // });

        drawLandmarks(canvasCtx, results.poseLandmarks, {
            color: 'green',
            radius: dimens.width >= 768 ? 10 : 4
        });
        canvasCtx.restore();

    }

    return (
        <div style = {{ display: 'flex', flexDirection: 'column', height: dimens.width >= 768 ? dimens.height - 100 : dimens.width - 84, position: 'relative' }}>
            <video
                ref={videoRef}
                style={{ display: "none" }}
                className="input_video"
            ></video>
            <canvas
                ref={canvasRef}
                className="output_canvas"
                width={ dimens.width >= 768 ? "1280px" : dimens.width }
                height={ dimens.width >= 768 ? "720px" : dimens.width - 160 }
                style = {{ alignSelf: dimens.width >= 768 ? 'center' : 'center', justifySelf: 'center' }}
            ></canvas>

        </div>
    )

}
