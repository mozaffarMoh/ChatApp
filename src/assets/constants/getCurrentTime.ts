

const getCurrentTime = () => {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed

    let amPm = 'AM'; // Default to AM

    // Convert hours to 12-hour format and determine AM/PM
    if (hours >= 12) {
        amPm = 'PM';
    }
    if (hours > 12) {
        hours -= 12;
    }

    // Ensure that midnight (00:00) is represented as 12:00 AM
    if (hours === 0) {
        hours = 12;
    }

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${amPm}`;

    //Output example: 06: 23 AM
    return formattedTime
}

export default getCurrentTime;