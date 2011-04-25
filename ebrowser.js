function createClickListener(theUrl)
{
  return function(ev){
    chrome.extension.sendRequest({urlHref: theUrl}, function(response) {
      console.log(response.farewell);
    });
  ev.preventDefault();

  };
}

if(top!=this){
　// 在frame中时处理
  var nodes = [];
  var result = document.evaluate(
    '//a[@href]',
    document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  while (item = result.iterateNext()) {
    nodes.push(item);
  }
  for (var i = 0; i < nodes.length; i++) {
    //nodes[i].setAttribute('href', 'http://liujuncheng.org');
    nodes[i].addEventListener('click', createClickListener(nodes[i].getAttribute('href')), false);
  }
}
else
{
  var input1 = document.createElement("input");
  input1.setAttribute("type", "hidden");
  input1.setAttribute("name", "isUrlChanged");
  input1.setAttribute("id", "isUrlChangedId");
  input1.setAttribute("value", "0");
  document.body.appendChild(input1);
  var input2 = document.createElement("input");
  input2.setAttribute("type", "hidden");
  input2.setAttribute("name", "urlInput");
  input2.setAttribute("id", "urlInputId");
  input2.setAttribute("value", "");
  document.body.appendChild(input2);
  chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.urlHref != "")
    {
      document.getElementById('isUrlChangedId').setAttribute('value', '1');
      document.getElementById('urlInputId').setAttribute('value', request.urlHref);
      sendResponse({farewell: "goodbye"});
    }
    else
      sendResponse({}); // snub them.
  });

}
