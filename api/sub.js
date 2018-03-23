var pool = require('../config/db.js');
var cron = require('node-cron');
var { ObjectId } = require('mongodb');


exports.subscript = function(req, res) {
    var order_id = req.body.order_id;
    var frequency = req.body.frequency;
    // var day = req.body.day;
    var duration = req.body.duration;

    receivedValues = req.body

    usercolumns = ["order_id", "frequency", "duration"];
    for (var iter = 0; iter < usercolumns.length; iter++) {
        columnName = usercolumns[iter];
        if (receivedValues[columnName] == undefined && (columnName == 'order_id' || columnName == 'frequency' || columnName == 'duration')) {
            console.log("*** Redirecting: ", columnName, " field is required")
            res.json({ "code": 200, "status": "Error", "message": columnName + " field is undefined" });
            return;
        } else if (columnName == 'duration') {
            console.log('receivedValues[columnName]', receivedValues[columnName]);
            if (!["week", "month"].includes(req.body.duration)) {
                res.json({ "code": 200, "status": "Error", "message": "duration field must be week or month" });
                return;
            }
        }
    }

    pool.connect(function(db) {
        if (db) {
            console.log('connected');
            subscription = db.collection('subscription');
            subscription.insert({
                    order_id: order_id,
                    frequency: frequency,
                    duration: duration,
                    create_at: new Date()
                },
                function(err, ins) {
                    if (!err) {
                        console.log('data inserted successfully');
                        res.send({ code: 200, status: 'success', message: 'subscripted successfully' });
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

exports.unsubscript = function(req, res) {
    var id = req.params.id;
    if (!id) {
        res.send({ code: 200, status: "error", message: '_id is required' });
        return;
    }
    console.log('id', id);
    pool.connect(function(db) {
        if (db) {
            console.log('connected');
            subscription = db.collection('subscription');
            // .sort({ "date": -1 })
            subscription.remove({ _id: ObjectId(id) },
                function(err, data) {
                    if (!err) {
                        console.log('total', data.length);
                        res.send({ code: 200, status: 'success', message: 'unsubscription successfully' });
                        return;
                    } else {
                        console.log('Errr', err);
                        res.send({ code: 200, status: 'error', message: 'Error for unsubscription' });
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

cron.schedule('* * * * * 1', function() {
    sendNotificationsPerWeek()
});

cron.schedule('* * * 1 * *', function() {
    sendNotificationsPerMonth()
});


// sendNotificationsPerWeek()
// sendNotificationsPerMonth()


function sendNotificationsPerWeek() {
    console.log('Send sendNotificationsPerWeek');
    pool.connect(function(db) {
        if (db) {
            console.log('connected');
            subscription = db.collection('subscription');
            // .sort({ "date": -1 })
            subscription.find({ "duration": "week" }).toArray(
                function(err, data) {
                    if (!err) {
                        console.log('total', data);
                        for (var i = 0; i < data.length; i++) {

                        }
                        return;
                    } else {
                        console.log('Errr', err);
                        return;
                    }
                });
        } else {
            console.log('Error');
            return;
        }
    })
}

function sendNotificationsPerMonth() {
    pool.connect(function(db) {
        if (db) {
            console.log('connected');
            subscription = db.collection('subscription');
            // .sort({ "date": -1 })
            subscription.find({ "duration": "month" }).toArray(
                function(err, data) {
                    if (!err) {
                        console.log('total', data);
                        for (var i = 0; i < data.length; i++) {

                        }
                        return;
                    } else {
                        console.log('Errr', err);
                        return;
                    }
                });
        } else {
            console.log('Error');
            return;
        }
    })
}

function pushNotification() {

}