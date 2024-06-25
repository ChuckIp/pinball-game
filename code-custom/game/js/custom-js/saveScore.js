// Save score - Save the score in the moodle database
const saveScore = (currentScore) => {
    const ENVIRONMENT = 'uat', // local, uat, prod
        LOCAL_BASE_URL = 'http://localhost:8888/ask-alexa/amznlms/server/', // Chuck's Local
        UAT_BASE_URL = 'https://uat.askalexa.com/',
        PROD_BASE_URL = 'https://www.askalexa.com/',
        WEBSERVICE_URL = 'webservice/rest/server.php',
        WS_TOKEN_ENDPOINT = '/local/wstoken/get_token.php?service=dataart',
        ADD_USER_SCORE_FUNCTION = 'local_iris_games_add_user_score',
        MOODLE_WS_REST_FORMAT = 'json';

    let WS_TOKEN  = '',
        BASE_URL = '',
        sessionDuration = '';

    // Game Settings
    const GAME_ID = 1;

    // Determine which base URL to use depeneding on the environment
    switch (ENVIRONMENT) {
        case 'local':
            BASE_URL = LOCAL_BASE_URL;
            break;
        case 'uat':
            BASE_URL = UAT_BASE_URL;
            break;
        case 'prod':
            BASE_URL = PROD_BASE_URL;
            break;
        default:
            BASE_URL = UAT_BASE_URL;
            break;
    }

    // Initialise the save the score function.
    const init = () => {
        getWsToken();
    }

    // Get the Ws Token in order to save the score
    const getWsToken = () => {
        $.ajax({
            method: 'GET',
            url: `${BASE_URL}${WS_TOKEN_ENDPOINT}`,
            dataType: MOODLE_WS_REST_FORMAT,
            xhrFields: {
                withCredentials: true,
            },
            error: (error) => {
                console.warn(error)
            },
            success: (response) => {
                WS_TOKEN = response?.token;

                // Calculate the session duration in seconds
                sessionDuration = sessionTimer('end');

                // Save the score
                addUserScore();
            }
        });
    }

    // Save the score in the moodle database
    const addUserScore = (session) => {
        $.ajax({
            url: `${BASE_URL}${WEBSERVICE_URL}?wstoken=${WS_TOKEN}&wsfunction=${ADD_USER_SCORE_FUNCTION}&moodlewsrestformat=${MOODLE_WS_REST_FORMAT}`,
            type: 'POST',
            dataType: MOODLE_WS_REST_FORMAT,
            data: {
                gameid: GAME_ID,
                score: currentScore,
                event: 'score',
                session_duration: sessionDuration,
            },
            error: (error) => {
                console.warn(error)
            },
            success: (response) => {
                // Get the high score from the database
                s_iTotalScore = response?.high_score;
            }
        });
    }

    init();
}