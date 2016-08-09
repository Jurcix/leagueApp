module.exports = {
    'secret': 'eeveeiscute',      
    'database': 'mongodb://localhost/leagueAppDB',
    'allowedUrls': [
        '/api/login',
        '/api/builds',
        '/builds/:build_id',
        '/api',
        '/'
    ]
};