//Storage Controller
const StorageController = (function () {
  return {
    storeProduct: function (product) {
      let products;
      if (localStorage.getItem("products") === null) {
        products = [];
        products.push(product);
      } else {
        products = JSON.parse(localStorage.getItem("products"));
        products.push(product);
      }
      localStorage.setItem("products", JSON.stringify(products));
    },
    getProducts: function () {
      let products;
      if (localStorage.getItem("products") === null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem("products"));
      }
      return products;
    },
    updateProduct: function (product) {
      let products = JSON.parse(localStorage.getItem("products"));
      products.forEach(function (prd, index) {
        if (product.id == prd.id) {
          products.splice(index, 1, product);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    },
    deleteProduct: function (id) {
      let products = JSON.parse(localStorage.getItem("products"));
      products.forEach(function (prd, index) {
        if (id == prd.id) {
          products.splice(index, 1);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    },
  };
})();

//Product Controller
const ProductController = (function () {
  //private
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };
  const data = {
    products: StorageController.getProducts(),
    // products: [
    //   { id: 0, name: "monitör", price: 100 },
    //   { id: 1, name: "Ram", price: 300 },
    //   { id: 2, name: "Klavye", price: 200 },
    // ],
    selectedProduct: null,
    totalPrice: 0,
  };

  return {
    getProducts: function () {
      return data.products;
    },
    getData: function () {
      return data;
    },
    getProductById: function (id) {
      let product = null;
      data.products.forEach(function (prd) {
        if (prd.id == id) {
          product = prd;
        }
      });
      return product;
    },
    addProduct: function (name, price) {
      let id;
      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }
      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    updateProduct: function (name, price) {
      let product = null;
      data.products.forEach(function (prd) {
        if (prd.id == data.selectedProduct.id) {
          prd.name = name;
          prd.price = parseFloat(price);
          product = prd;
        }
      });
      return product;
    },
    deleteProduct: function (product) {
      data.products.forEach(function (prd, index) {
        if (prd.id == product.id) {
          data.products.splice(index, 1);
        }
      });
    },
    getTotal: function () {
      let total = 0;
      data.products.forEach(function (item) {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
    setCurrentProduct: function (product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function () {
      return data.selectedProduct;
    },
  };
})();

//UI Controller

const UIController = (function () {
  const Selectors = {
    productList: "#item-list",
    addButon: ".addBtn",
    updateButon: ".updateBtn",
    cancelButon: ".cancelBtn",
    deleteButon: ".deleteBtn",
    productName: "#productName",
    productPrice: "#productPrice",
    productCard: "#productCard",
    totalTl: "#total-tl",
    totalDolar: "#total-dolar",
    productListItems: "#item-list tr",
  };

  return {
    createProductList: function (products) {
      let html = "";
      products.forEach((prd) => {
        html += `<tr>
          <td>${prd.id}</td>
          <td>${prd.name}</td>
          <td>${prd.price}</td>
          <td class="text-right">
           
              <i class="far fa-edit edit-product">Edit</i>
           
          </td>
        </tr>`;
      });

      document.querySelector(Selectors.productList).innerHTML = html;
    },
    getSelectors: function () {
      return Selectors;
    },
    addProduct: function (prd) {
      // console.log(document.querySelector("#productCard"));
      document.querySelector("#productCard").style.display = "block";
      var item = `<tr>
      <td>${prd.id}</td>
      <td>${prd.name}</td>
      <td>${prd.price}</td>
      <td class="text-right">
          <i class="far fa-edit edit-product">Edit</i>
       
      </td>
    </tr>`;
      document.querySelector(Selectors.productList).innerHTML += item;
    },
    updateProduct: function (prd) {
      let updatedItem = null;
      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.children[1].textContent = prd.name;
          item.children[2].textContent = prd.price + "$";
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    clearInputs: function () {
      document.querySelector(Selectors.productName).value = "";
      document.querySelector(Selectors.productPrice).value = "";
    },
    clearWarnings: function () {
      const items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.classList.remove("bg-warning");
        }
      });
    },
    hideCard: function () {
      document.querySelector("#productCard").style.display = "none";
    },
    showTotal: function (total) {
      document.querySelector(Selectors.totalDolar).textContent = total;
      document.querySelector(Selectors.totalTl).textContent = total * 4.5;
    },
    addProductToForm: function () {
      const selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selectors.productName).value =
        selectedProduct.name;
      document.querySelector(Selectors.productPrice).value =
        selectedProduct.price;
    },
    addingState: function (item) {
      UIController.clearWarnings();
      UIController.clearInputs();
      document.querySelector(Selectors.addButon).style.display = "inline";
      document.querySelector(Selectors.cancelButon).style.display = "none";
      document.querySelector(Selectors.deleteButon).style.display = "none";
      document.querySelector(Selectors.updateButon).style.display = "none";
    },
    deleteProduct: function () {
      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.remove();
        }
      });
    },
    editState: function (tr) {
      // const parent = tr.parentNode;
      // for (let i = 0; i < parent.children.length; i++) {
      //   parent.children[i].classList.remove("bg-warning");
      // }

      tr.classList.add("bg-warning");
      document.querySelector(Selectors.addButon).style.display = "none";
      document.querySelector(Selectors.cancelButon).style.display = "inline";
      document.querySelector(Selectors.deleteButon).style.display = "inline";
      document.querySelector(Selectors.updateButon).style.display = "inline";
    },
  };
})();

//App Controller

const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
  const UISelectors = UICtrl.getSelectors();

  //load event listener

  const loadEventListener = function () {
    //add product event
    document
      .querySelector(UISelectors.addButon)
      .addEventListener("click", function (e) {
        const productName = document.querySelector(
          UISelectors.productName
        ).value;

        const productPrice = document.querySelector(
          UISelectors.productPrice
        ).value;

        if (productName !== "" && productPrice !== "") {
          //add product
          const newProduct = ProductCtrl.addProduct(productName, productPrice);
          //add item to list
          UICtrl.addProduct(newProduct);

          //add product to local storage
          StorageCtrl.storeProduct(newProduct);

          //get total
          const total = ProductCtrl.getTotal();
          console.log(total);
          //temizleme

          //show total
          UICtrl.showTotal(total);

          UICtrl.clearInputs();
        }

        e.preventDefault();
      });
    //product edit click
    document
      .querySelector(UISelectors.productList)
      .addEventListener("click", productEditClick);
    // edit product submit
    document
      .querySelector(UISelectors.updateButon)
      .addEventListener("click", editProductSubmit);
    //cancel button click

    document
      .querySelector(UISelectors.cancelButon)
      .addEventListener("click", cancelUpdate);
    //delete click
    document
      .querySelector(UISelectors.deleteButon)
      .addEventListener("click", deleteProductSubmit);
  };
  const productEditClick = function (e) {
    if (e.target.classList.contains("edit-product")) {
      console.log(e.target);
      console.log(
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent
      );
      //get selected product

      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;

      const product = ProductCtrl.getProductById(id);
      console.log(product);
      //set current product
      ProductCtrl.setCurrentProduct(product);
      UICtrl.clearWarnings();
      //add product to uı
      UICtrl.addProductToForm();
      UICtrl.editState(e.target.parentNode.parentNode);
    }
    e.preventDefault();
  };
  const editProductSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      const updatedProduct = ProductCtrl.updateProduct(
        productName,
        productPrice
      );
      //update UI
      let item = UICtrl.updateProduct(updatedProduct);
      //update storage
      StorageCtrl.updateProduct(updatedProduct);
      const total = ProductCtrl.getTotal();
      UICtrl.showTotal(total);
      UICtrl.addingState();
    }
    e.preventDefault();
  };
  const cancelUpdate = function (e) {
    UICtrl.addingState();
    UICtrl.clearWarnings();
    e.preventDefault();
  };
  const deleteProductSubmit = function (e) {
    const selectedProduct = ProductCtrl.getCurrentProduct();
    //delete product
    ProductCtrl.deleteProduct(selectedProduct);

    //delete UI
    UICtrl.deleteProduct();
    const total = ProductCtrl.getTotal();
    UICtrl.showTotal(total);
    //delete from storage
    StorageCtrl.deleteProduct(selectedProduct.id);
    UICtrl.addingState();
    if (total == 0) {
      UICtrl.hideCard();
    }
    e.preventDefault();
  };

  return {
    init: function () {
      UIController.addingState();

      console.log("starting app..");
      const products = ProductCtrl.getProducts();
      console.log(products);
      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
      }
      loadEventListener();
    },
  };
})(ProductController, UIController, StorageController);

App.init();
