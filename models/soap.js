// Soap Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soapSchema = new Schema(
{
      name: String,
      image:  String,
      percentSuperFat: Number,
      ingredients: [Schema.Types.Mixed],
      costPerBar: {type: Number, default: 5},
      costPerPound: {type: Number, default: 55},
      addCostToGiftWrapPerBar: {type: Number, default: 1.5},
      lyeCalculation: [Schema.Types.Mixed],
      totalOilsWeight: Number,
      totalRecipeWeight: Number,
      totalBarsAvail: Number,
      exfoliating: {type: Boolean, default: false},
      notes: [String]
} , {timestamps: true});

// has to be below soapSchema initialization
const Soap = mongoose.model('Soap', soapSchema);
module.exports = Soap
