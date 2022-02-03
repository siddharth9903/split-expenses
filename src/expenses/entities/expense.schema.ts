import * as mongoose from 'mongoose';


export const ExpensesSchema = new mongoose.Schema({
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  reciever:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  amount:{
    type:Number
  },
  description: {
    type: String,
  },
})
  // export const ExpensesSchema = new mongoose.Schema({
  
//   group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'groups' },
//   description: {
//     type: String,
//   },
//   paid_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
//   paid_to_users: [
//     {
//       paid_to: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
//       amount: {
//         type: String,
//       },
//       settled: {
//         type: String,
//       },
//     },
//   ],
//   amount: {
//     type: String,
//   },
//   created_date: { type: Date, default: Date.now() },
//   updated_date: { type: Date, default: Date.now() },
//   notes: [
//     {
//       note: { type: String },
//       created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
//       created_date: { type: Date, default: Date.now() },
//     },
//   ],
// });
