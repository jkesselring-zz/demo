/*
  For brevity and simplicity I have included all JavaScript functionality in this file.
  Typically this file would have been split into several logical files for easier and
  more efficient consumption as necessary.

  Please note: I didn't have for JavaScript that I could easily pull apart for this purpose so what I created below
  is an approximation of a different system I have worked on.

  Created by: Joseph Kesselring
  (for my reference)Last Updated: March 1, 2018 @ 22:54
*/

/*
  If we wanted to get fancier we could have field be an array of objects with validation and rules on it.
  Because of the nature of this application I have elected for the flatter solution for readability.
*/
'use strict'

var canUserSubmitForm = false;
var rulesPassed = new Array();

/*
------------ Validation -----------------
*/
function Validation() {};

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
    var uniqueRuleName = this.field.name + '_' + rule.name;
    let regex = new RegExp(rule.rule_pattern);
    //swap this for a more robust system if we were going to include more 'complex' tests.
    //or preferred, refactor. This block is getting a bit convoluted.
    if (rule.isNumber) {
      var val = parseInt(this.value);
      this.isValid = regex.test(val)
    } else {
      this.isValid = regex.test(this.value);
    }
    if (this.isValid) {
      //Prevent duplicate rules from being added.
      // Would need to DRY this up
      let isRuleAlreadyAdded = rulesPassed.find((rule_name) => {
        return rule_name === uniqueRuleName;
      });
      if(!isRuleAlreadyAdded)
        rulesPassed.push(this.field.name + '_' + rule.name);
    }
    else {
      console.error('Value failed to pass ' + rule.name, this.value);

      let isRuleAlreadyAdded = rulesPassed.find((rule_name) => {
        return rule_name === uniqueRuleName;
      });
      let ruleIndex = rulesPassed.find((rule) => {
        return rule === uniqueRuleName;
      })
      rulesPassed.splice(ruleIndex, 1);
    }
  });
  console.log('rules passed', rulesPassed);
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

//If this were to be flexible we'd expand this out, or refactor to not use regex as a default.
var MinLength = Object.create(new Rule());
MinLength.name = "minLength";
MinLength.rule_pattern = /^[a-zA-Z0-9]{3,}$/;

//To highlight how we might create other validation rules.
var Numeric = Object.create(new Rule());
Numeric.name = "numeric";
Numeric.rule_pattern = /^[0-9]*$/; //regex for numeric values
Numeric.isNumber = true;

function handleSubmitEnable() {
  const signinButton = document.getElementById("signin");
  if (rulesPassed.length !== 2) {
    signinButton.disabled = true;
  }
  else {
    signinButton.disabled = false;
  }
}

/*
  -------- Logging ----------
*/

function Logger() { }
Logger.prototype.title = '';
Logger.prototype.time = '';
Logger.prototype.log = function () {
  console.log(this.time + " " +this.title+ " " + this.event);
};
Logger.prototype.event = '';


/*
------------ Bootstrapping Rules -----------------
*/

function wireValidation() {
  /*
    In a real world scenario we'd likely have several validation methods for different field rules.
    Each field might also validate on several event types such as blur, keyup, etc.
  */
  const username_element = document.getElementById("username");
  const password_element = document.getElementById("password");
  const signin_element = document.getElementById("signin");

  const username_validation = Object.create(new Validation());
  username_validation.field = username_element;
  username_validation.rules = [MinLength];
  username_validation.handleValidate = username_validation.handleValidate.bind(username_validation);

  const password_validation = Object.create(new Validation());
  password_validation.field = password_element;
  password_validation.rules = [MinLength];
  password_validation.handleValidate = password_validation.handleValidate.bind(password_validation);

  //I might refactor this I had more time.
  password_element.addEventListener("blur", password_validation.handleValidate, false);
  password_element.addEventListener("keyup", password_validation.handleValidate, false);
  username_element.addEventListener("blur", username_validation.handleValidate, false);
  username_element.addEventListener("keyup", username_validation.handleValidate, false);

  username_element.addEventListener("keyup", handleSubmitEnable, false);
  password_element.addEventListener("keyup", handleSubmitEnable, false);
  signin_element.addEventListener("click", (event) => {
    event.preventDefault();
    alert('Signin Submitted');
    const loggerSignin = new Logger();
    loggerSignin.log.bind(loggerSignin);
    loggerSignin.time = Date.now();
    loggerSignin.title = "User X has requested login.";
    loggerSignin.log(); //prevent default and fire ajax
  }, false);
}

/*
  Would attach this to an onload or activate component in a SPA.
  Also, I would refactor slightly to better handle targeted validation if such solutions were required.
*/
wireValidation();
