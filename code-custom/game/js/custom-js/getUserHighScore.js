// Get user high score - Save the score in the moodle database
const getUserHighScore = () => {
    const BASE_URL = '',
        // BASE_URL = 'http://localhost:8888/ask-alexa/amznlms/server/', // TESTING - Chuck's Local
        // BASE_URL = 'https://uat.askalexa.com/', // TESTING
        // BASE_URL = 'https://www.askalexa.com/', // TESTING
        WEBSERVICE_URL = '/webservice/rest/server.php',
        WS_TOKEN_ENDPOINT = '/local/wstoken/get_token.php?service=dataart',
        GET_USER_SCORE_FUNCTION = 'local_iris_games_get_user',
        MOODLE_WS_REST_FORMAT = 'json';

    let WS_TOKEN  = '';

    // Game Settings
    const GAME_ID = 1;

    // Initialise the get user function.
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

                // Get User details
                getUser();
            }
        });
    }

    // Save the score in the moodle database
    const getUser = () => {
        $.ajax({
            url: `${BASE_URL}${WEBSERVICE_URL}?wstoken=${WS_TOKEN}&wsfunction=${GET_USER_SCORE_FUNCTION}&moodlewsrestformat=${MOODLE_WS_REST_FORMAT}&gameid=${GAME_ID}`,
            method: 'GET',
            dataType: MOODLE_WS_REST_FORMAT,
            error: (error) => {
                console.warn(error);
            },
            success: (response) => {
                // Get the high score from the database and set it
                s_iTotalScore = response?.high_score?.score;
            }
        });
    }

    init();
}