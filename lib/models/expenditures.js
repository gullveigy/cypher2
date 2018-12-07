'use strict';

var mongoose = require('mongoose');

var ExpenditureSchema = new mongoose.Schema({
        email: String,
        date: String,
        payment: String,
        type: String,
        amount: Number,
        message: String
}, { collection: 'expendituredb' });

module.exports = mongoose.model('Expenditure', ExpenditureSchema);