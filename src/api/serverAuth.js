sysToken = '';
recentUsers = {};

exports.getLevel = async function(user_id) {
    if(!recentUsers.hasOwnProperty(user_id)) {
        recentUsers[user_id] = await getLevelFromServer(user_id);
    }
    return recentUsers[user_id];
};

getLevelFromServer = function(user_id){
    return getSysToken().then(() => {
        let request = require("request-promise");
        let options = {
            method: 'GET',
            url: 'https://rwwittenberg.auth0.com/api/v2/users/' + user_id,
            qs: {fields: 'app_metadata', include_fields: 'true'},
            headers:
                {
                    'content-type': 'application/json',
                    authorization: `Bearer ${sysToken}`
                }
        };
        return (request(options)
            .then(response => {
                try {
                    return JSON.parse(response)['app_metadata']['level'];
                }catch(e){
                    return "newUser";
                }
            }));
    });
};

getSysToken = function(){
    let request = require("request-promise");

    let options = { method: 'POST',
        url: 'https://rwwittenberg.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body:
            { grant_type: 'client_credentials',
                client_id: 'fROUBRhDoOuMPdLBX2rtHxrZFPFVo171',
                client_secret: '-yWrqF9i6V4t9rlV-_l8bkl4fExqvml6L1b_y5_gLvD2aIdgIe1_q-FkWDzovL5O',
                //audience: 'https://msrapitest/'},
                audience: 'https://rwwittenberg.auth0.com/api/v2/'},
        json: true };

    return request(options)
        .then(response => {
            sysToken = response['access_token'];
        });
};

exports.getUsers = (req, res) => {
    let request = require("request-promise");
    let options = {
        method: 'GET',
        url: 'https://rwwittenberg.auth0.com/api/v2/users',
        //qs: {fields: 'app_metadata', include_fields: 'true'},
        headers:
            {
                'content-type': 'application/json',
                authorization: `Bearer ${sysToken}`
            }
    };
    console.log('[auth] Getting all users');
    return (request(options)
        .then(response => {
            console.log('[auth] Success');
            res.status(200).send(response);
        }).catch(error => {
            console.log('[auth] 500 ' + error);
            res.status(500).send(error);
        }));
};

exports.updateUser = (req, res) => {
    let request = require("request-promise");
    let options = {
        method: 'PATCH',
        url: `https://rwwittenberg.auth0.com/api/v2/users/${req.body.user_id}`,
        headers:
            {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sysToken}`
            },
        body: `{"app_metadata":{"level":"${req.body.newLevel}"}}`
    };
    console.log('[auth] Updating user ' + JSON.stringify(req.body));
    return request(options)
        .then(response => {
            console.log('[auth] Success');
            res.status(200).send(response);
        }).catch(error => {
            console.log('[auth] 500 ' + error);
            res.status(500).send(error);
        });
};

exports.getPerms = (req, res) => {
    let u = req.user['sub'];
    exports.getLevel(u)
        .then(user_level => res.status(200).send(user_level))
        .catch(error => res.status(500).send(error));
};