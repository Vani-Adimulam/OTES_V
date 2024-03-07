import React, { useState, useEffect } from 'react';

const Timer = () => {
    const initialTime = 120; // 200 seconds
    const [time, setTime] = useState(initialTime);
    const [alertShown, setAlertShown] = useState(false);

    useEffect(() => {
        const startTime = parseInt(localStorage.getItem('startTime'), 10) || Date.now();
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = initialTime - elapsedTime;

        setTime(remainingTime);
        localStorage.setItem('timer', remainingTime);
        localStorage.setItem('startTime', startTime);

        const interval = setInterval(() => {
            setTime(prevTime => {
                if (prevTime > 0) {
                    const newTime = prevTime - 1;
                    localStorage.setItem('timer', newTime);
                    if (newTime === 60) {
                        alert('60 seconds remaining!');
                    // } else if (newTime === 180 && !alertShown) {
                    //     alert('Time is up! So test will be auto submitted.');
                    //     if (document.getElementById("submit_test_auto")) {
                    //         document.getElementById("submit_test_auto").click();
                    //     }
                    //     setAlertShown(true);
                    } else if (newTime === 0) {
                        localStorage.removeItem('timer');
                        localStorage.removeItem('startTime');
                        if (!alertShown) {
                            alert('Time is up! So test will be auto submitted.');
                            if (document.getElementById("submit_test_auto")) {
                                document.getElementById("submit_test_auto").click();
                            }
                            setAlertShown(true);
                        }
                    }
                    return newTime;
                } else {
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []); // Empty dependency array to run effect only once

    const formatTime = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}M:${seconds.toString().padStart(2, '0')}S`;
    };

    return (
        <div style={{ fontWeight: 'bold' }}>
            &nbsp;Time Left - {formatTime()}
        </div>
    );
};

export default Timer;
