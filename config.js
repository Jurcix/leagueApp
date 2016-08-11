module.exports = {
    'secret': 'eeveeiscute',      
    'database': 'mongodb://localhost/leagueAppDB',
    'allowedUrls': [
        '/api/login',
        '/login',
        '/login/',
        '/users',
        '/users/',
        '/users/:username',
        '/api/users/:username',
        '/api/users/',
        '/api/builds',
        '/builds',
        '/builds/',
        '/builds/:build_id',
        '/api',
        '/'
    ]
};