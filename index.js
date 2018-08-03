const request = require("request-promise-lite");
const AWS = require("aws-sdk");
const topic = new AWS.IotData({endpoint: process.env.ENDPOINT});

exports.handler = (event, context, callback) => {
    console.log(event);
    if(event.type === "init")
    {
        request.get("https://api.untappd.com/v4/user/checkins/" + event.user + "?" + process.env.APIKEY)
            .then((response) => {
                var json = JSON.parse(response);

                var last_checkin = json.response.checkins.items[0].checkin_id;

                topic.publish({
                    topic: "untappdReply",
                    payload: JSON.stringify({init: last_checkin}),
                    qos: 0
                }, function (err, data) {
                    if(err)
                    {
                        console.log(err);
                    }
                    callback(err, data);
                });
            });
    }
    else if(event.type === "poll")
    {
        request.get("https://api.untappd.com/v4/user/checkins/" + event.user + "?min_id=" + event.since + "&" + process.env.APIKEY)
            .then((response) => {
                var json = JSON.parse(response);

                json.response.items.forEach((item) => {
                    item.badges.items.forEach((badge) => {
                        topic.publish({
                            topic: "untappdReply",
                            payload: JSON.stringify({
                                name: badge.badge_name,
                                image: "/" + badge.badge_image.sm.split("/").pop(),
                                id: item.checkin_id
                            }),
                            qos: 0
                        }, (err) => {
                            if(err) {console.log(err);}
                        });
                    });
                });
            })
    }
};