richtext.Input = function() {
  this.textStyles = [];
  this.render();
  this.charRange = new richtext.CharRange(this.editableElement);
};

richtext.Input.prototype.size = 10;

richtext.Input.prototype.formatter = null;

richtext.Input.prototype.render = function() {
  this.containerElement = document.createElement('div');
  this.containerElement.className = 'richtext';
  this.containerElement.style.overflow = 'hidden';
  richtext.makeInlineBlock(this.containerElement);
  this.containerElement.style.width = this.size + 1 + 'em';
  this.containerElement.style.height = "1em";

  this.editableElement = document.createElement('div');
  this.editableElement.style.width = "100000px"; // TODO: be reasonable
  this.editableElement.style.height = "1em";

  this.containerElement.appendChild(this.editableElement);
  this.editableElement.contentEditable = true;

  this.createInputElement_();

  this.editableElement.onfocus = function() {
    // select all text?
  };

  var self = this;
  this.editableElement.onkeyup = function () {
    var value = self.getText();
    if (value != self.inputElement.value) {
      self.inputElement.value = value;
      self.format();
    }
  };
};

richtext.Input.prototype.createInputElement_ = function() {
  var inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  this.containerElement.appendChild(inputElement);
  this.inputElement = inputElement;
};


richtext.Input.prototype.getText = function() {
  var text = typeof this.editableElement.innerText != 'undefined' ?
      this.editableElement.innerText : this.editableElement.textContent;
  return text.replace('\n', '');
};

richtext.Input.prototype.setText = function(text) {
  this.editableElement.innerHTML = '';
  this.editableElement.appendChild(document.createTextNode(text));
};


richtext.Input.prototype.format = function() {
  var text = this.getText();
  var currentSelection = this.charRange.getSelectionIndexes();
  if (text) {
    if (!this.formatter) { return; }
    this.editableElement.innerHTML = this.formatter.format(this.getText());
  } else {
    this.editableElement.innerHTML = '<br />';
  }
  this.charRange.refresh();
  if (currentSelection[0] != null) {
    this.charRange.setSelectionIndexes.apply(this.charRange, currentSelection);
  }
};