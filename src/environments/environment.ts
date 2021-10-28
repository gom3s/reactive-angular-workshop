export const environment = {
    production: false,
    MARVEL_API: {
        URL: 'https://gateway.marvel.com:443',
        PUBLIC_KEY: '041cf2b7dd5df876468c3e2cb8612e59',
        PRIVATE_KEY: '24f27c0a5f1e30f6cd44e580d7595092ff107534',
    },
};

if (environment.MARVEL_API.PUBLIC_KEY === 'INSERT YOUR KEY FIRST') {
    /**
     * To get access to the marvel API, you need to go to their site and sign up for an account.
     * Go Here: https://developer.marvel.com/
     *
     * Once you have done that, in their portal, you will need to add http://localhost to their
     * whitelisted domains. If you don't do this, it will fail for you.
     */
    document.write('INSERT YOUR KEY FIRST');
    throw new Error('You must setup a public and private API key first.');
}
