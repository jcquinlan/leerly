export const addUserToMailingList = async (email) => {
    return fetch('/api/addContact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    });
};
