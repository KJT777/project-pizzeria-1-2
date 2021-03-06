/*global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
      initData:function(){
        const thisApp = this;
     
        thisApp.data = dataSource;
       },
       initMenu: function() {
        const testProduct = new Product();
       },
       initData: function() {
        const thisApp = this;
        thisApp.data = dataSource;
        console.log(thisApp.data);
   
         for(let productData in thisApp.data.products){
          new Product(productData, thisApp.data.products[productData]);
         }  
       },
      init: function(){
        const thisApp = this;
        thisApp.initData();

        thisApp.initMenu();
    }
  };
  //deklaracja klasy Product,
  class Product{
    constructor(id,data){
      console.log(data);
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
    }
    // metoda renderInMenu
    renderInMenu(){
      const thisProduct = this;
      getElements(){
        const thisProduct = this;
      
        thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
        thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
        thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
        thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
        thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
        thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);	
        thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      }
         /*generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /*create element using utils. createElementFrom HTML*/ 
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu*/ 
      menuContainer.appendChild(thisProduct.element);
    }

    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      /* START: click event listener to trigger */
      clickableTrigger.addEventListener('click', function() {
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts) {
          /* START: if the active product isn't the element of thisProduct */
          if (activeProduct != thisProduct.element) {
            /* remove class active for the active product */
            activeProduct.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
        /* END: click event listener to trigger */
      });
    }

  
  }

app.init();
}
initOrderForm() {	
  const thisProduct = this;	
  thisProduct.form.addEventListener('submit', function(event){
    event.preventDefault();
    thisProduct.processOrder();
  });
  
  for(let input of thisProduct.formInputs){
    input.addEventListener('change', function(){
      thisProduct.processOrder();
    });
  }
  
  thisProduct.cartButton.addEventListener('click', function(event){
    event.preventDefault();
    thisProduct.processOrder();
  });
}
processOrder(){ //obliczanie ceny produktu
  const thisProduct = this;
  // console.log('processOrder');
  const formData = utils.serializeFormToObject(thisProduct.form);
  console.log('formData',formData);
  /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
  const formData = utils.serializeFormToObject(thisProduct.form);          // zawiera zaznaczone opcje
  // console.log('formData', formData);
  /* set variable price to equal thisProduct.data.price */
  let price = thisProduct.data.price;
  // console.log(price);
  /* START LOOP: for each paramId in thisProduct.data.params */
  for (let paramId in thisProduct.data.params) {
    /* save the element in thisProduct.data.params with key paramId as const param */
    const param = thisProduct.data.params[paramId];
    // console.log(param);
    /* START LOOP: for each optionId in param.options */
    for (let optionId in param.options) {
      // console.log(optionId);
      /* save the element in param.options with key optionId as const option */
      const option = param.options[optionId];
          // console.log(option);
      /* START IF: if option is selected and option is not default */
      const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
      if(optionSelected && !option.default){
        // ...
        /* add price of option to variable price */
        price += option.price;
      /* END IF: if option is selected and option is not default */
      }
      /* START ELSE IF: if option is not selected and option is default */
      else if (!optionSelected && option.default) {
        /* deduct price of option from price */
        price -= option.price;
      }
      /* END ELSE IF: if option is not selected and option is default */
      }
      const activeImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
      // console.log('activeImages', activeImages);
      if (optionSelected) {
      for (let activeImage of activeImages) {
      activeImage.classList.add(classNames.menuProduct.imageVisible);
      }
      } else {
      for (let activeImage of activeImages) {
      activeImage.classList.remove(classNames.menuProduct.imageVisible);
      }
    }
    const selector = '.' + paramId + '-' + optionId;
          const optionImages = thisProduct.imageWrapper.querySelectorAll(selector);
          // console.log(optionImages);
          if (optionSelected) {
            for (let optionImage of optionImages) {
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            }
          }
          else {
            for (let optionImage of optionImages) {
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }

      /* END LOOP: for each optionId in param.options */
        }
      /* END LOOP: for each paramId in thisProduct.data.params */
            }
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = price;
        /* multiply price by amount */
        price *= thisProduct.amountWidget.value;
        //console.log(price);
        thisProduct.priceElem.innerHTML = price;
        //widget wyboru ilosci produktu
      initAmountWidget () {
        const thisProduct = this;
        thisProduct.amountWidget = new AmountWidget (thisProduct.amountWidgetElem);
        thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder());
      }
  
    class AmountWidget {
      constructor(element) {
        const thisWidget = this;
  
        thisWidget.getElements(element);
        thisWidget.value = settings.amountWidget.defaultValue;
        thisWidget.setValue(thisWidget.input.value);
        this.Widget.initActions ();
  
        //console.log('amountWidget:', thisWidget);
        //console.log('constructor arguments:', element);
      }
      getElements(element){
        const thisWidget = this;
  
        thisWidget.element = element;
        thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
        thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
        thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      }
      setValue(value){
        const thisWidget = this;
        const newValue = parseInt(value);
  
        /*TODO: Add validation*/
  
        if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings. amountWidget.defaultMax) {
          thisWidget.value = newValue;
          thisWidget.announce ();
        }
        thisWidget.input.value = thisWidget.value;
      }
      initActions(){
        const thisWidget = this;
        thisWidget.input.addEventListener('change', setValue(value));
        thisWidget.linkDecrease.addEventListener('click', setValue(thisWidget.value -1));
        thisWidget.linkIncrease.addEventListener('click', setValue(thisWidget.value +1));
      }
      announce() {
        const thisWidget = this;
        const event = new Event ('updated');
        thisWidget.element.dispatchEvent(event);
      }
    }
    const app = {
      initMenu: function() {
  
      }
    }