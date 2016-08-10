module.exports = {
    'secret': 'eeveeiscute',      
    'database': 'mongodb://localhost/leagueAppDB',
    'allowedUrls': [
        '/api/login',
        '/login',
        '/login/',
        '/api/builds',
        '/builds',
        '/builds/',
        '/builds/:build_id',
        '/api',
        '/'
    ]
};