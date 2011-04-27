function createClickListener(targetAnchor)
{
  return function(ev){
    if (targetAnchor.target == "_top" || targetAnchor.target == "_blank" 
      || targetAnchor.target == "_self" || targetAnchor.target == "_parent" 
      || targetAnchor.target.length == 0)
    {
      chrome.extension.sendRequest({pageId: window.name, pageJumpType: 'anchorJump', pageJumpURL: targetAnchor.href, pageJumpTarget: targetAnchor.target}, function(response) {
        console.log(response.farewell);});
      ev.preventDefault();
    }
    else
    {
	alert(targetAnchor.target);
    }
  };
}

if(top!=this && parent == top){
  chrome.extension.sendRequest({pageId: window.name, pageJumpType: 'selfJump', pageJumpURL: document.URL, pageJumpTarget: ""}, function(response) {
        console.log(response.farewell);});

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
    nodes[i].addEventListener('click', createClickListener(nodes[i]), false);
  }
}
else
{
/*
  var pageJumpType = document.createElement("input");
  pageJumpType.setAttribute("type", "hidden");
  pageJumpType.setAttribute("id", "pageJumpType");
  pageJumpType.setAttribute("value", "noJump");
  document.body.appendChild(pageJumpType);

  var pageJumpURL = document.createElement("input");
  pageJumpURL.setAttribute("type", "hidden");
  pageJumpURL.setAttribute("id", "pageJumpURL");
  pageJumpURL.setAttribute("value", "");
  document.body.appendChild(pageJumpURL);

  var pageJumpTarget = document.createElement("input");
  pageJumpTarget.setAttribute("type", "hidden");
  pageJumpTarget.setAttribute("id", "pageJumpTarget");
  pageJumpTarget.setAttribute("value", "");
  document.body.appendChild(pageJumpTarget);
*/
  chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.pageJumpType == 'anchorJump' || request.pageJumpType == 'selfJump')
    {
      var pageJumpForm = document.createElement("form");
      pageJumpForm.setAttribute("name", "pageJumpForm");
      pageJumpForm.setAttribute("id", request.pageId);
      
      var pageJumpType = document.createElement("input");
      pageJumpType.setAttribute("type", "hidden");
      pageJumpType.setAttribute("id", "pageJumpType");
      pageJumpType.setAttribute("value", request.pageJumpType);
      pageJumpForm.appendChild(pageJumpType);

      var pageJumpURL = document.createElement("input");
      pageJumpURL.setAttribute("type", "hidden");
      pageJumpURL.setAttribute("id", "pageJumpURL");
      pageJumpURL.setAttribute("value", request.pageJumpURL);
      pageJumpForm.appendChild(pageJumpURL);

      var pageJumpTarget = document.createElement("input");
      pageJumpTarget.setAttribute("type", "hidden");
      pageJumpTarget.setAttribute("id", "pageJumpTarget");
      pageJumpTarget.setAttribute("value", request.pageJumpTarget);
      pageJumpForm.appendChild(pageJumpTarget);

      document.body.appendChild(pageJumpForm);


      //document.getElementById('pageJumpType').value = request.pageJumpType;
      //document.getElementById('pageJumpURL').value = request.pageJumpURL;
      //document.getElementById('pageJumpTarget').value = request.pageJumpTarget;
      sendResponse({farewell: "goodbye"});
    }
    else
      sendResponse({}); // snub them.
  });
}
