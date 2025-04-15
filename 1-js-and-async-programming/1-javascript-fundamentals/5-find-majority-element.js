/* 
Challenge: "Find Majority Element";

The function findMajorityElement accepts an array of numbers and returns the majority element if it exists, otherwise returns null. The majority element is the element that appears more than n/2 times in the array.

Requirements:
- The function should handle arrays of any length.
- The function should return the majority element if it exists, otherwise return null.
- The function should be efficient and handle large arrays.
- The function should not modify the original array.

Example:
findMajorityElement([1, 2, 3, 1, 1]); // Expected output: 1
findMajorityElement([1, 2, 3, 4]); // Expected output: null
findMajorityElement([1, 1, 2, 2, 2]); // Expected output: 2
findMajorityElement([1, 2, 2, 3, 3, 3]); // Expected output: null
findMajorityElement([1, 2, 3, 4, 5]); // Expected output: null


*/

const findMajorityElement = (arr) => {
    const requiredFrequency = arr.length / 2;

    const frequencies = new Map();
    for (const element of arr) {
        const currentFrequency = frequencies.get(element) ?? 0;
        frequencies.set(element, currentFrequency + 1);
        
        if (frequencies.get(element) > requiredFrequency)
            return element;
    }

    return null;
};

module.exports = findMajorityElement;
