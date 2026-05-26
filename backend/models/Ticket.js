const mongoose = require('mongoose');

const SLATargets = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320,
};

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for ageMinutes
ticketSchema.virtual('ageMinutes').get(function () {
  const endTime = this.resolvedAt ? this.resolvedAt : new Date();
  const diffInMs = endTime - this.createdAt;
  return Math.floor(diffInMs / (1000 * 60));
});

// Virtual for slaBreached
ticketSchema.virtual('slaBreached').get(function () {
  const slaTargetMinutes = SLATargets[this.priority] || 0;
  return this.ageMinutes > slaTargetMinutes;
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
