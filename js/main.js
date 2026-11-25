
class Product {
  #name;
  #price;
  #stock;

  constructor({name, price, stock}) {
    this.#name = this.#normalizeName(name);
    this.#price = price;
    this.#stock = stock;
  }

  #normalizeName(name) {
    const trimmedName = name.trim();
    const firstLetter = trimmedName[0].toUpperCase();
    const copyName = trimmedName.slice(1).toLowerCase();
    return firstLetter + copyName;
  }

  isInStock() {
    if (this.stock > 0) {
      return true;
    }
  }

  get name() {
    return this.#name;
  }

  get price() {
    return this.#price;
  }

  set price(newPrice) {
    if(newPrice > 0) {
      this.#price = newPrice;
    }
  }

  get stock() {
    return this.#stock;
  }

  set stock(newStock) {
    this.#stock = newStock;
  }

  describe() {
    console.log(`Товар: ${this.name}, ціна: ${this.price} грн`);
  }

  isInStock() {
    return this.stock > 0;
  }

  sell(quantity) {
    if (this.stock <= quantity) {
      return false;
    }
    else {
      this.stock = this.stock - quantity;
      return true;
    }
  }

  restock(quantity) {
    this.stock = this.stock + quantity;
  }

  getPriceWithDiscount(discount) {
    const priceWithDiscount = this.price / 100 * (100-discount);
    return priceWithDiscount;
  }

  static isValidPrice(price) {
    if (Number.isInteger(price) && price > 0) {
      return true;
    }
    else {
      return false;
    }
  }

}


class Store {
  #products = [];

  // Додавання товару
  addProduct(product) {
    if (!(product instanceof Product)) {
      console.error("Це не екземпляр Product!");
      return false;
    }

    if (this.hasProduct(product.name)) {
      console.error("Такий товар вже існує!");
      return false;
    }

    this.#products.push(product);
    return true;
  }

  // Видалення товару за назвою
  removeByName(name) {
    const normalizedName = name.trim().toLowerCase();

    const index = this.#products.findIndex(
      (product) => product.name.toLowerCase() === normalizedName
    );

    if (index === -1) {
      return false;
    }

    this.#products.splice(index, 1);
    return true;
  }

  // Кількість товарів
  get count() {
    return this.#products.length;
  }

  // Повернення копії масиву
  getAll() {
    return [...this.#products];
  }

  // Пошук товару
  findByName(name) {
    const normalizedName = name.trim().toLowerCase();

    return this.#products.find(
      (product) => product.name.toLowerCase() === normalizedName
    );
  }

  // Перевірка наявності товару в магазині
  hasProduct(name) {
    const normalizedName = name.trim().toLowerCase();

    return this.#products.some(
      (product) => product.name.toLowerCase() === normalizedName
    );
  }

  // Товари, які є в наявності
  getInStock() {
    return this.#products.filter(
      (product) => product.stock > 0
    );
  }

  // Перевірка, чи всі товари є в наявності
  isEverythingInStock() {
    return this.#products.every(
      (product) => product.stock > 0
    );
  }

  // Масив назв товарів
  getNames() {
    return this.#products.map(
      (product) => product.name
    );
  }

  // Список цін
  getPriceList() {
    return this.#products.map(
      (product) => `${product.name} — ${product.price} грн`
    );
  }

  // Загальна вартість складу
  getTotalValue() {
    return this.#products.reduce(
      (total, product) => total + product.price * product.stock,
      0
    );
  }

  // Найдешевший товар
  getCheapest() {
    if (this.#products.length === 0) {
      return null;
    }

    return this.#products.reduce(
      (cheapest, product) =>
        product.price < cheapest.price ? product : cheapest
    );
  }

  // Сортування за ціною
  sortByPrice(order = "asc") {
    const productsCopy = [...this.#products];

    return productsCopy.sort((a, b) => {
      if (order === "desc") {
        return b.price - a.price;
      }

      return a.price - b.price;
    });
  }

  // Ціни зі знижкою
  getDiscountedPrices(percent) {
    return this.#products.map((product) => ({
      name: product.name,
      newPrice: product.getPriceWithDiscount(percent)
    }));
  }
}


const store = new Store();

const laptop = new Product({ name: "  НОУТБУК ", price: 25000, stock: 5 });
const phone = new Product({ name: "смартфон", price: 15000, stock: 0 });
const headphones = new Product({ name: "НАВУШНИКИ", price: 3000, stock: 10 });
const mouse = new Product({ name: " миша ", price: 800, stock: 20 });

console.log(store.addProduct(laptop)); // true
console.log(store.addProduct(phone)); // true
console.log(store.addProduct(headphones)); // true
console.log(store.addProduct(mouse)); // true
console.log(store.addProduct(mouse)); // false + помилка в консолі (дубль)
console.log(store.addProduct({ name: "Підробка" })); // false + помилка в консолі
console.log(store.count); // 4

// find / some
console.log(store.findByName("  НОУТБУК").describe());
// "Товар: Ноутбук, ціна: 25000 грн"
console.log(store.findByName("планшет")); // undefined
console.log(store.hasProduct("миша")); // true
console.log(store.hasProduct("планшет")); // false

// filter / every
console.log(store.getInStock().map((p) => p.name));
// ["Ноутбук", "Навушники", "Миша"]
console.log(store.isEverythingInStock()); // false

// map
console.log(store.getNames());
// ["Ноутбук", "Смартфон", "Навушники", "Миша"]
console.log(store.getPriceList());
// ["Ноутбук — 25000 грн", "Смартфон — 15000 грн",
//  "Навушники — 3000 грн", "Миша — 800 грн"]

// reduce
console.log(store.getTotalValue()); // 171000
console.log(store.getCheapest().name); // "Миша"

// sort (не змінює оригінальний порядок!)
console.log(store.sortByPrice().map((p) => p.name));
// ["Миша", "Навушники", "Смартфон", "Ноутбук"]
console.log(store.sortByPrice("desc").map((p) => p.name));
// ["Ноутбук", "Смартфон", "Навушники", "Миша"]
console.log(store.getNames());
// ["Ноутбук", "Смартфон", "Навушники", "Миша"] (порядок не змінився)

// map з новими об'єктами
console.log(store.getDiscountedPrices(10));
// [
//   { name: "Ноутбук", newPrice: 22500 },
//   { name: "Смартфон", newPrice: 13500 },
//   { name: "Навушники", newPrice: 2700 },
//   { name: "Миша", newPrice: 720 },
// ]

// Захист внутрішнього масиву
const all = store.getAll();
all.push("сміття");
all.length = 0;
console.log(store.count); // 4 (внутрішній масив не постраждав)

// splice / findIndex
console.log(store.removeByName("смартфон")); // true
console.log(store.removeByName("смартфон")); // false
console.log(store.getNames()); // ["Ноутбук", "Навушники", "Миша"]
console.log(store.isEverythingInStock()); // true

// порожній магазин
const empty = new Store();
console.log(empty.getCheapest()); // null
console.log(empty.getTotalValue()); // 0
console.log(empty.isEverythingInStock()); // true (!) — так працює every
