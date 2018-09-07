"use strict";

var 	db = require('./nodebb').db,
        nconf = require('./nodebb').nconf;

        module.exports = function(Telegram) {
	
	// filter:user.customSettings
	Telegram.addUserSettings = function(settings, callback) {
        console.log('addUserSettings');
		// todo: use settings.tpl instead
		//updated since v0.8.3 to use custom settings
		//test if address already stored DB
        db.getObjectField('user:' + settings.uid + ':settings', 'telegramid', function(err, t_id) {
			if (err) {
				callback(err);
			}

			//If we have address, add to the input field
			if(t_id){
				console.log(' addUserSettings:', t_id);
				settings.customSettings.push({
			                                title: "Telegram Id",
			                                content: "<label>user number</label><input type='text' data-property='telegramid' placeholder='e.g 12345678' class='form-control' value='"+ t_id +"'/>"
		                                });				
			//No address, so leave input empty
		    }else{
				//No address so display empty field
				console.log(' addUserSettings: No Address');
				settings.customSettings.push({
			                                title: "Telegram Id",
			                                content: "<label>user number</label><input type='text' data-property='telegramid' placeholder='e.g 12345678' class='form-control'/>"
		                                });
			}
		});

		callback(null, settings);
	};

	// filter:user.getSettings
	Telegram.getUserSettings = function(data, callback) {
			// Temp console to check results			
			//Get setting from DB
        db.getObjectField('user:' + data.uid + ':settings', 'telegramid', function(err,t_id) {
			if (err) {
				callback(err);
			}
			//Write data to the address field
			//This seem broken since v0.8.3 - something to do with customSettings, so do it hte hard way in addUserSettings
			data.settings.telegramid = t_id;
			callback(null, data);
		});	
	};
	
	// action:user.saveSettings
	Telegram.saveUserSettings = function(data,callback) {
	console.log('\n\n\n',data);
		if (data.uid) {
			// Temp console to check results			
			console.log(' UID to Save', data.uid);			
			

			if (data.settings.telegramid) {
			console.log(' Address to Save', data.settings.telegramid);
            db.sortedSetRemove("telegramid:uid", data.settings.telegramid);
			db.setObjectField('user:' + data.uid + ':settings', 'telegramid', data.settings.telegramid);
            var obj = { value: data.settings.telegramid, score:data.uid };
            db.sortedSetAdd("telegramid:uid", data.uid, data.settings.telegramid, callback); // Index to get uid from telegramid
			}else{
			// else field empty
			// Temp console to check results			
			//console.log(' Somethign to Save empty', data.settings.address);
			db.setObjectField('user:' + data.uid + ':settings', 'telegramid', '');
		
			}

		}

	};
	/*
	// filter:post.posts.custom_profile_info
	Telegram.addProfileInfo = function(profileInfo, callback) {
		// get user telegramid
		db.getObjectField('user:' + profileInfo.uid + ':settings', 'nodebb-plugin-Telegram:telegramid', function(err, telegramid){
		// get user name
		db.getObjectField('user:' + profileInfo.uid, 'username', function(err, username){
		// console log result
		console.log('Setting Profile User Settings', username);
		// console log result
			if (address){
				// console log result
				console.log('Setting Profile User has address', username);
					profileInfo.profile.push({content: "<span class='tipping-field' title='Tip " + username + " with Reddcoin'><strong><a href='reddcoin:" + telegramid + "?label=Tip%20To%20" + username + "'><img class='tipping-icon' src='" + nconf.get('relative_path') + "/plugins/nodebb-plugin-reddcoin/images/rdd_icon.png'><span class='hidden-xs-inline'> Tip " + username + "</span></a></strong></span>"});
				} else {
				// console log result
				console.log('Setting Profile User does not have address', username);
					profileInfo.profile.push({content: "<span class='tipping-field' title='" + username + " does not have a tip address'><strong><span class='hidden-xs-inline'><img class='tipping-icon' src='" + nconf.get('relative_path') + "/plugins/nodebb-plugin-reddcoin/images/rdd_icon.png'> Tip " + username + "</span></strong></span>"});		
				}
				
			});
		
		callback(err, profileInfo);

		});

	};
*/		
    };

