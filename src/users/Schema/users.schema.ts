import mongoose, { Schema, Document } from 'mongoose';
import { role } from 'src/enum/role.enum';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
  teamLeader?: mongoose.Types.ObjectId;
  reportingManager?: mongoose.Types.ObjectId;
  createBy: mongoose.Types.ObjectId;
  createAt: Date;
}

export const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'Please provide name.'],
    minlength: [5, 'Name should be min 5 char.'],
    maxlength: [20, 'Name should be max 20 char.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email.'],
    match: [/\S+@\S+\.\S+/, 'Invalid email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter password.'],
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: {
    type: String,
    required: [true, 'Please provide correct role.'],
    enum: role,
  },
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
    default: null,
  },
  teamLeader : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "users",
    default : null
  },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default : null 
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
