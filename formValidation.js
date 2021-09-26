//Validater function
function Validater(options) {
    function getParent(element, selecter) {
        while (element.parentElement) {
            if (element.parentElement.matches(selecter)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {};
    //function validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGruopSelecter).querySelector(options.errorSelecter);
        var errorMessage;
        //select rules
        var rules = selectorRules[rule.selector];
        //check rule if error break
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                case 'checkbox':
                    var checkboxValues = Array.from(formElement.querySelectorAll(rule.selector));
                    for (var j = 0; j < checkboxValues.length; ++j) {
                        if (!checkboxValues[j].matches(':checked')) {
                            errorMessage = rules[i](checkboxValues[j].matches(':checked'));
                            break;
                        }
                    }
                    break;
                case 'date':

                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

                    if (inputElement.value >= date) {
                        errorMessage = rules[i]();
                        console.log(errorMessage);
                    }
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
                }

                if (errorMessage) {
                    break;
                }
            }
            if (errorMessage) {
                errorElement.innerText = errorMessage;
                getParent(inputElement, options.formGruopSelecter).querySelector(options.errorSelecter).classList.add('invalid');
                getParent(inputElement, options.formGruopSelecter).querySelector('.form-control').classList.remove('input-enter');
                getParent(inputElement, options.formGruopSelecter).querySelector('.form-control').classList.add('input-false');

            } else {
                errorElement.innerText = '';
                getParent(inputElement, options.formGruopSelecter).querySelector(options.errorSelecter).classList.remove('invalid');
                getParent(inputElement, options.formGruopSelecter).querySelector('.form-control').classList.remove('input-enter');
                getParent(inputElement, options.formGruopSelecter).querySelector('.form-control').classList.remove('input-false');
            }

            return !errorMessage;
        }

        //get element form
        var formElement = document.querySelector(options.form);
        if (formElement) {

            //when submit form
            formElement.onsubmit = function(e) {
                e.preventDefault();
                var isFormValid = true;
                options.rules.forEach(function(rule) {
                    var inputElement = formElement.querySelector(rule.selector);
                    var isValid = validate(inputElement, rule);
                    if (!isValid) {
                        isFormValid = false;
                    }
                });
                if (isFormValid) {
                    //submit with javascrip
                    if (typeof options.onSubmit === 'function') {
                        var enableInputs = formElement.querySelectorAll('[name]:not([disabled]');
                        var formValues = Array.from(enableInputs).reduce(function(values, input) {
                            switch (input.type) {
                                case 'radio':
                                    values[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                                    break;
                                case 'checkbox':
                                    if (!input.matches(':checked')) {
                                        values[input.name] = '';
                                        return values;
                                    }
                                    if (!Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                    break;
                                case 'file':
                                    values[input.name] = input.files;
                                    break;
                                default: values[input.name] = input.value;
                                }

                                return values;
                            },
                            {});

                            options.onSubmit(formValues);
                        }
                        //submit with event default
                        else {
                            formElement.submit();
                        }
                    }
                }

                options.rules.forEach(function(rule) {

                    //Save rules in each input
                    if (Array.isArray(selectorRules[rule.selector])) {
                        selectorRules[rule.selector].push(rule.test);
                    } else {
                        selectorRules[rule.selector] = [rule.test];
                    }
                    var inputElements = formElement.querySelectorAll(rule.selector);

                    Array.from(inputElements).forEach(function(inputElement) {

                        if (inputElement) {
                            //When blur
                            inputElement.onblur = function() {
                                validate(inputElement, rule);
                            }
                            //When focus
                            inputElement.onfocus = function() {

                                if (!inputElement.classList.contains('input-false')) {
                                    getParent(inputElement, options.formGruopSelecter).querySelector('.form-control').classList.add('input-enter');
                                }
                            }
                            //When input
                            inputElement.oninput = function() {
                                var errorElement = getParent(inputElement, options.formGruopSelecter).querySelector(options.errorSelecter);
                                errorElement.innerText = '';
                                getParent(inputElement, options.formGruopSelecter).querySelector(options.errorSelecter).classList.remove('invalid');
                                getParent(inputElement, options.formGruopSelecter).querySelector('.form-control').classList.add('input-enter');
                                getParent(inputElement, options.formGruopSelecter).querySelector('.form-control').classList.remove('input-false');
                            }
                        }

                    });
                });
            }
        }
        //contructor
        Validater.isRequired = function(selector, message) {
            return {
                selector: selector,
                test: function(value) {
                    return value ? undefined: message || 'Please inter this information!';
                }
            }
        }

        Validater.isEmail = function(selector, message) {
            return {
                selector: selector,
                test: function(value) {
                    var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    return regex.test(value) ? undefined: message || 'Email invalid!';
                }
            }
        }

        Validater.isLength = function(selector, min, message) {
            return {
                selector: selector,
                test: function(value) {
                    return value.length >= min ? undefined: message || `Enter at least ${min} characters!`;
                }
            }
        }

        Validater.isConfirmation = function(selector, getConfirmValue, message) {
            return {
                selector: selector,
                test: function(value) {
                    return value === getConfirmValue() ? undefined: message || 'Invalid input value!';
                }
            }
        }

        Validater({
            form: '#form-1',
            formGruopSelecter: '.form-group',
            errorSelecter: '.form-message',
            rules: [
                Validater.isRequired('#fullname',
                    'Please enter your full name!'),
                Validater.isRequired('#birth-date',
                    'Birth date invalid!'),
                Validater.isRequired('#avatar',
                    'Please choose your avatar!'),
                Validater.isRequired('#email',
                    'Please enter your email!'),
                Validater.isEmail('#email'),
                Validater.isRequired('#password',
                    'Please enter your password!'),
                Validater.isLength('#password',
                    6),
                Validater.isRequired('#password-confirmation',
                    'Please enter your password confirmation!'),
                Validater.isConfirmation('#password-confirmation',
                    function() {
                        return document.querySelector('#form-1 #password').value;
                    },
                    'Password confirmation not true!'),
                Validater.isRequired('input[name="gender"]',
                    'Please choose your sex!'),
                Validater.isRequired('#province',
                    'Please choose your province!'),
                Validater.isRequired('input[name="rule"]',
                    'You must agree to all terms of service!'),
            ],
            onSubmit: function(data) {
                //Call API
                console.log(data);
            }
        });