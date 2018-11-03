let mongoose = require('mongoose');

let ExpenditureSchema = new mongoose.Schema({
        username:String,
        date: String,
        payment:String,
        amount: Number,
        description:  {type: String, default:"None"}
    },
    { collection: 'expendituredb' });

module.exports = mongoose.model('Expenditure', ExpenditureSchema);
