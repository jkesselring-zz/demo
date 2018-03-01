/*
  For brevity and simplicity I have included all JavaScript functionality in this file.
  Typically this file would have been split into several logical files for easier and more efficient consumption as necessary.
*/

/*
  If we wanted to get fancier we could have field be an array of objects with validation and rules on it.
  Because of the nature of this application I have elected for the flatter solution for readability.
*/
'use strict'

var canUserSubmitForm = false;
var rulesPassed = [];

/*
------------ Validation -----------------
*/
function Validation() { };

Validation.prototype.handleValidate = function () {
  if (this.rules.length === 0 || typeof (this.rules) === 'undefined') {
    console.error('Rules is either not defined or has a size of 0.');
  }
  this.validate();
}

Validation.prototype.validate = function () {
  this.value = this.field.value;
  if (this.value === null) {
    console.error('Value is null', this.value);
    return;
  }
  console.debug('What really is this.value even?', this.value);
  this.rules.forEach(rule => {
    let regex = new RegExp(rule.rule_pattern);
    if (rule.isNumber) { //swap this for a more robust system if we were going to include more 'complex' tests.
      var val = parseInt(this.value);
      this.isValid = regex.test(val)
    } else {
      this.isValid = regex.test(this.value);
    }
    if (!this.isValid) {
      console.error('Value failed to pass ' + rule.name, this.value);
    }
  });
  console.log('Are we valid?', this.isValid);
}

/*
------------ Validation Rules -----------------
*/
function Rule(can_be_empty = false) {
  this.can_be_empty = can_be_empty;
}

Rule.prototype.rule_pattern = '';

/*
------------ Validation Rules Implementation -----------------
*/
var Numeric = Object.create(new Rule());
Numeric.name = "numeric";
Numeric.rule_pattern = /^[0-9]*$/;
Numeric.isNumber = true;

var MinLength = Object.create(new Rule());
MinLength.name = "minLength";
MinLength.rule_pattern = /^[a-zA-Z0-9]{3,}$/; //If this were to be flexible we'd expand this out, or refactor to not use regex.

/*
------------ Bootstrapping Rules -----------------
*/

function wireValidation(validate) {
  if (!validate) {
    console.log('No validation is desired');
  }
  /*
    In a real world scenario we'd likely have several validation methods for different field rules.
    Each field might also validate on several event types such as blur, keyup, etc.
  */
  const username_element = document.getElementById("username");
  const password_element = document.getElementById("password");

  const username_validation = Object.create(new Validation());
  username_validation.field = username_element;
  username_validation.rules = [Numeric, MinLength];
  username_validation.handleValidate = username_validation.handleValidate.bind(username_validation);

  /* TODO: Password rules are undefined. */
  const password_validation = Object.create(new Validation());
  password_validation.field = password_element;
  username_validation.rules = [MinLength];
  password_validation.handleValidate = password_validation.handleValidate.bind(password_validation);

  password_element.addEventListener("blur", password_validation.handleValidate, false);
  username_element.addEventListener("blur", username_validation.handleValidate, false);
}

wireValidation(true);
