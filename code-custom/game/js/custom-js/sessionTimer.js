let beginSession ='',
    endSession = '';

// Session Timer - record how long the user has been playing
const sessionTimer = (action) => {
    if (action === 'begin') {
        beginSession = new Date();
    } else if (action === 'end') {
        endSession = new Date();

        // Calculate the session duration in seconds
        return Math.round((endSession - beginSession) / 1000);
    }
}