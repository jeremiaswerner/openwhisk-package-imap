var request = require('request');


function main(params) {

	var serviceEndpont = 'http://imapserviceprovider.mybluemix.net';
	var requiredParams = ['user', 'pass', 'host', 'mailbox'];
	var lifecycleEvent = params.lifecycleEvent;
	var triggerName = params.triggerName.split("/");
	var whiskKey = whisk.getAuthKey().split(":");
	// var endpoint = 'openwhisk.ng.bluemix.net';

	// var whiskCallbackUrl = 'https://' + whisk.getAuthKey() + "@" + endpoint + '/api/v1/namespaces/' + triggerName[1] + '/triggers/' + triggerName[2];

	var lifecycleEvent = params.lifecycleEvent || 'CREATE';
	if (lifecycleEvent == 'CREATE') {
		var body = {
			'host': params.host,
			'user': params.user,
			'pass': params.pass,
			'mailbox': params.mailbox,
			'name': triggerName[2],
			'namespace': triggerName[1]
		};

		var options = {
			method: "POST",
			uri: serviceEndpont + "/triggers",
			json: JSON.stringify(body),
			auth: {
				user: whiskKey[0],
				pass: whiskKey[1]
			},
			headers: {
				'Content-Type': 'application/json'
			}
		};

		request(options, function(error, response, body) {
			if (!error && response.statusCode == 201) {
				console.log(body);
				return whisk.done(JSON.parse(body));

			} else {
				console.log('http status code:', (response || {}).statusCode);
				console.log('error:', error);
				console.log('body:', body);
				whisk.error({
					error: error
				});
			}
		});
	} else if (lifecycleEvent == 'RESUME') {
		return whisk.error({error:"RESUME ligecycleEvent not available yet"});
	} else if (ligecycleEvent == 'PAUSE') {
		return whisk.error({error:"PAUSE ligecycleEvent not available yet"});
	} else {
		var options = {
			method: "DELETE",
			uri: serviceEndpont + "/triggers/" + triggerName[1] + "/" + triggerName[2],
			auth: {
				user: whiskKey[0],
				pass: whiskKey[1]
			},
			headers: {
				'Content-Type': 'application/json'
			}
		};

		request(options, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				return whisk.done(JSON.parse(body));
			} else {
				console.log('http status code:', (response || {}).statusCode);
				console.log('error:', error);
				console.log('body:', body);
				whisk.error({
					error: error
				});
			}
		});
	}

	return whisk.async();
}