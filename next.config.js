module.exports = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'x-leerly-token',
                        value: 'firebase user auth token',
                    },
                ]
            },
        ]
    },
}
