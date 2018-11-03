let mongoose = require('mongoose');

let IncomeSchema = new mongoose.Schema({
        username:String,
        date: String,
        incomingmode:String,
        amount: Number,
        description:  {type: String, default:"None"}
    },
    { collection: 'incomedb' });

module.exports = mongoose.model('Income', IncomeSchema);
