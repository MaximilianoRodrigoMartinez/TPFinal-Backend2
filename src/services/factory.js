const ProductService = require("./productService");
const CartService = require("./cartService");
const UserService = require("./userService");
const TicketService = require("./ticketService");

class ServiceFactory {
  static getProductService() {
    return ProductService;
  }

  static getCartService() {
    return CartService;
  }

  static getUserService() {
    return UserService;
  }

  static getTicketService() {
    return TicketService;
  }
}

module.exports = ServiceFactory;

