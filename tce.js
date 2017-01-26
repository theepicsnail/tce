const blockCommentRegex = new RegExp(/\/\*([\s\S]+)\*\//g);

function ObjectForEach(obj, cb) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k))
      cb(k, obj[k], obj);
  }
}

function CustomElement(Element) {
  // Create our prototype, todo: add 'extends' abilities.
  var proto = Object.create(HTMLElement.prototype);

  // Pull the html template from the dom() method.
  let template = document.createElement("template");

  template.innerHTML = blockCommentRegex.exec(Element.dom.toString())[1];

  proto.createdCallback = function() {
    console.log("Created");
    // When we create a new instance, add a clone of the template.
    var root = this.attachShadow({mode : 'open'});
    var clone = template.content.cloneNode(true);
    root.appendChild(clone);
    // Wire up events.
    ObjectForEach(Element.events, function(selector, events) {
      root.querySelectorAll(selector).forEach((elem) => {
        ObjectForEach(events, function(name, cb) {
          elem['on' + name] = function() { cb.bind(root)(this, ...arguments); }
        });
      });
    });
  };

  document.registerElement(Element.tag, {prototype : proto});
}
