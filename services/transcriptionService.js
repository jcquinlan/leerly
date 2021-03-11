export const fetchArticleTranscription = (transcriptionId) => {
    return fetch(`/api/transcriptions/${transcriptionId}`)
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.error(err);
        });
}
