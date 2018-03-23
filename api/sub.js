var pool = require('../config/db.js');
var cron = require('node-cron');

/*
# ┌────────────── second (optional)
# │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
*/

cron.schedule('0 */1 * * * *', function() {
    // sendNotifications()
});

function sendNotifications() {
    console.log('Send notifictaion');
}

exports.store_sub = function(req, res) {
    var order_id = req.body.order_id;
    var frequency = req.body.frequency;
    var day = req.body.day;
    var time_duration = req.body.time_duration;

    receivedValues = req.body

    usercolumns = ["order_id", "frequency", "day", "time_duration"];
    for (var iter = 0; iter < usercolumns.length; iter++) {
        columnName = usercolumns[iter];
        if (receivedValues[columnName] == undefined && (columnName == 'order_id' || columnName == 'frequency' || columnName == 'day' || columnName == 'time_duration')) {
            console.log("*** Redirecting: ", columnName, " field is required")
            res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
            return;
        }
    }

    pool.connect(function(db) {
        if (db) {
            console.log('connected');
            subscription = db.collection('subscription');
            subscription.insert({ order_id: order_id, frequency: frequency, day: day, time_duration: time_duration },
                function(err, ins) {
                    if (!err) {
                        console.log('data inserted successfully');
                        res.send({ code: 200, status: 'success', message: 'subscription added successfully' });
                        return;
                    } else {
                        console.log('Error for insert into database', err);
                        res.send({ code: 200, status: 'error', message: 'Error for add new subscription' });
                        return;
                    }
                })
        } else {
            console.log('Error');
            res.send({ code: 200, status: 'error', message: 'Error for connect with database' });
            return;
        }
    })
}

exports.all_sub = function(req, res) {
    pool.connect(function(db) {
        if (db) {
            console.log('connected');
            subscription = db.collection('subscription');
            // .sort({ "date": -1 })
            subscription.find().toArray(
                function(err, data) {
                    if (!err) {
                        console.log('total', data.length);
                        res.send({ code: 200, status: 'success', message: 'subscription data get successfully', 'data': data });
                        return;
                    } else {
                        console.log('Errr', err);
                        res.send({ code: 200, status: 'error', message: 'Error for get subscription data' });
                        return;
                    }
                });
        } else {
            console.log('Error');
            res.send({ code: 200, status: 'error', message: 'Error for connect with database' });
            return;
        }
    })
}