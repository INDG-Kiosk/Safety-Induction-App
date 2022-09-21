import Webcam from 'react-webcam'
import React, {Component, useState} from 'react'

const WebcamComponent = () => <Webcam />

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: 'user',
}

const TestWebCam = () => {
  const webcamRef = React.useRef(null)
  const [image, setImage] = useState('')

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImage(imageSrc)
  }, [webcamRef])

  return (
    <div className='webcam-container'>
      <div className='webcam-img'>
        {image == '' ? (
          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            width={220}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} />
        )}
      </div>
      <div>
        {image != '' ? (
          <button
            onClick={(e) => {
              e.preventDefault()
              setImage('')
            }}
            className='webcam-btn'
          >
            Retake Image
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault()
              capture()
            }}
            className='webcam-btn'
          >
            Capture
          </button>
        )}
      </div>
    </div>
  )
}

export default TestWebCam
