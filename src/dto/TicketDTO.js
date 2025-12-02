class TicketDTO {
  static toDTO(ticket) {
    if (!ticket) {
      return null;
    }

    return {
      _id: ticket._id,
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  static toDTOArray(tickets) {
    if (!Array.isArray(tickets)) {
      return [];
    }
    return tickets.map(ticket => this.toDTO(ticket));
  }
}

module.exports = TicketDTO;
