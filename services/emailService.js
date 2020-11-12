// TODO - Delete this method after launch as we only use it for beta signups
export const addUserToMailingList = async (email) => {
    return fetch('/api/addContact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    });
};

export const addUserToProductionMailingList = async (email) => {
    return fetch('/api/email/addToProductionList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    });
};
