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
    const differenceInSecs = Math.abs(a - b);

    const hours = Math.floor(differenceInSecs / 3600);
    const remainingSeconds = differenceInSecs % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const parseTimeUnit = (timeUnit) => timeUnit.toString().padStart(2, '0');
    return `${parseTimeUnit(hours)}:${parseTimeUnit(minutes)}:${parseTimeUnit(seconds)}`;
};

module.exports = timeDifference;
