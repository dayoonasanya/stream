// Import necessary modules
import { Schema, model, Document } from 'mongoose';

// Define an interface for the Notification model
export interface NotificationDocument extends Document {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  userId?: string; // Optional: to link notifications to specific users
}

// Define the Notification schema
const NotificationSchema = new Schema<NotificationDocument>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: false, // Optional: to link notifications to specific users
  },
});

// Create and export the Notification model
export const Notification = model<NotificationDocument>('Notification', NotificationSchema);
