const crypto = require('crypto');

const SLATargets = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320,
};

let tickets = [];

class Ticket {
  constructor(data) {
    this._id = crypto.randomUUID();
    this.subject = data.subject;
    this.description = data.description;
    this.customerEmail = data.customerEmail;
    this.priority = data.priority;
    this.status = data.status || 'open';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.resolvedAt = null;
  }

  get ageMinutes() {
    const endTime = this.resolvedAt ? new Date(this.resolvedAt) : new Date();
    const diffInMs = endTime - new Date(this.createdAt);
    return Math.floor(diffInMs / (1000 * 60));
  }

  get slaBreached() {
    const slaTargetMinutes = SLATargets[this.priority] || 0;
    return this.ageMinutes > slaTargetMinutes;
  }

  toJSON() {
    return {
      _id: this._id,
      id: this._id, // Some frontends prefer id
      subject: this.subject,
      description: this.description,
      customerEmail: this.customerEmail,
      priority: this.priority,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
      ageMinutes: this.ageMinutes,
      slaBreached: this.slaBreached,
    };
  }

  static async create(data) {
    const newTicket = new Ticket(data);
    tickets.push(newTicket);
    return newTicket.toJSON();
  }

  static async find(query = {}) {
    let result = tickets;
    
    if (query.status) {
      result = result.filter(t => t.status === query.status);
    }
    
    if (query.priority) {
      result = result.filter(t => t.priority === query.priority);
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(t => t.toJSON());
  }

  static async findById(id) {
    return tickets.find(t => t._id === id);
  }

  static async update(id, updates) {
    const ticketIndex = tickets.findIndex(t => t._id === id);
    if (ticketIndex === -1) return null;
    
    const ticket = tickets[ticketIndex];
    Object.assign(ticket, updates);
    ticket.updatedAt = new Date();
    
    return ticket.toJSON();
  }

  static async deleteOne(id) {
    const initialLength = tickets.length;
    tickets = tickets.filter(t => t._id !== id);
    return tickets.length < initialLength;
  }
}

module.exports = Ticket;
