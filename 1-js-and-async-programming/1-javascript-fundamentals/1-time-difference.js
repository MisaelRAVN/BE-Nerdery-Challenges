/*
Challenge 1

"Time difference calculator"

The function timeDifference accepts two positive numbers representing time in seconds. You should modify the function to return the difference between the two times in a human-readable format HH:MM:SS.

Requirements:
- The function should accept two positive numbers representing time in seconds.
- The function should return the absolute difference between the two times.
- The result should be formatted as HH:MM:SS.

Example:

timeDifference(7200, 3400); // Expected output: "01:03:20"

*/

const timeDifference = (a, b) => {
    const SECONDS_IN_AN_HOUR = 3600;
    const SECONDS_IN_A_MINUTE = 60;

    const differenceInSecs = Math.abs(a - b);

    const hours = Math.floor(differenceInSecs / SECONDS_IN_AN_HOUR);
    const remainingSeconds = differenceInSecs % SECONDS_IN_AN_HOUR;
    const minutes = Math.floor(remainingSeconds / SECONDS_IN_A_MINUTE);
    const seconds = remainingSeconds % SECONDS_IN_A_MINUTE;

    const parseTimeUnit = (timeUnit) => timeUnit.toString().padStart(2, '0');
    return `${parseTimeUnit(hours)}:${parseTimeUnit(minutes)}:${parseTimeUnit(seconds)}`;
};

module.exports = timeDifference;
