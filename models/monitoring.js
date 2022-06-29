const mongoose = require('mongoose')

const monitoringSchema = mongoose.Schema(
    {
        email : {
            type: String,
        },
        lastTimeConnected : {
            type : Number,
        },
        numberOfTimesConnected : {
            type: Number,
        }
    }
)

module.exports = mongoose.model('Monitoring', monitoringSchema)