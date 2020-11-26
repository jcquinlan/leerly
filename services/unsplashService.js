export const queryUnsplash = async (query) => {
    const response = await fetch('/api/images/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query})
    });

    const session = await response.json();

    return session;
}

export const triggerUnsplashDownload = async (image) => {
    const response = await fetch('/api/images/triggerDownload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({image})
    });

    const session = await response.json();

    return session;
}

export const unsplashImageToSimplifiedImage = (unsplashImage) => {
    return {
        id: unsplashImage.id,
        description: unsplashImage.description,
        urls: {
            small: unsplashImage.urls.small,
            regular: unsplashImage.urls.regular
        },
        user: {
            name: unsplashImage.user.name,
            profile: unsplashImage.user.links.html
        }
    };
};