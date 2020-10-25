export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'


class AuthenticationService {

    registerSuccessfulLogin(username, password) {
        console.log('PRE - Register Successful');
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
        console.log('POST - Register Successful');
    }

    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return false
        return true
    }

}

export default new AuthenticationService()