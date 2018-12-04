let mongoose = require('mongoose');

let IncomeSchema = new mongoose.Schema({
        email:String,
        date: String,
        incomingmode:String,
        type: String,
        amount: Number,
        message: String
    },
    { collection: 'incomedb' });

module.exports = mongoose.model('Income', IncomeSchema);
