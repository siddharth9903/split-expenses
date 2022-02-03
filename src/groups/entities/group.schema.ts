import * as mongoose from 'mongoose';
export const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});
