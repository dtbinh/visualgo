// @author  Ivan Reinaldo
// Defines a BST object; keeps implementation of BST internally and interact with GraphWidget to display BST visualizations
// Also includes AVL tree

var BST = function(){
  var self = this;
  var graphWidget = new GraphWidget();
  var isAVL = false;

  var valueRange = [1, 100]; // Range of valid values of BST vertexes allowed
  var maxHeightAllowed = 4;

  /*
   * internalBst: Internal representation of BST in this object
   * The keys are the text of the nodes, and the value is the attributes of the corresponding node encapsulated in a JS object, which are:
   * - "parent": text of the parent node. If the node is root node, the value is null.
   * - "leftChild": text of the left child. No child -> null
   * - "rightChild": text of the right child. No child -> null
   * - "cx": X-coordinate of center of the node
   * - "cy": Y-coordinate of center of the node
   * - "height": height of the node. Height of root is 0
   * - "vertexClassNumber": Vertex class number of the corresponding node
   *
   * In addition, there is a key called "root" in internalBst, containing the text of the root node.
   * If BST is empty, root is null.
   */

  var internalBst = {};
  var amountVertex = 0;
  internalBst["root"] = null;

  dummyInit();

  this.getGraphWidget = function(){
    return graphWidget;
  }

  function dummyInit(){
    internalBst["root"] = 42;
    internalBst[42] = {
      "parent": null,
      "leftChild": 30,
      "rightChild": 54,
      "vertexClassNumber": 0
    };
    internalBst[30] = {
      "parent": 42,
      "leftChild": null,
      "rightChild": null,
      "vertexClassNumber": 1
    };
    internalBst[54] = {
      "parent": 42,
      "leftChild": 48,
      "rightChild": 65,
      "vertexClassNumber": 2
    };
    internalBst[48] = {
      "parent": 54,
      "leftChild": null,
      "rightChild": null,
      "vertexClassNumber": 3
    };
    internalBst[65] = {
      "parent": 54,
      "leftChild": null,
      "rightChild": null,
      "vertexClassNumber": 4
    };

    recalculatePosition();

    var key;

    for(key in internalBst){
      if(key == "root") continue;

      var currentVertex = internalBst[key];
      graphWidget.addVertex(currentVertex["cx"], currentVertex["cy"], key, currentVertex["vertexClassNumber"], true);
    }

    for(key in internalBst){
      if(key == "root") continue;

      var currentVertex = internalBst[key];
      var parentVertex = internalBst[currentVertex["parent"]];
      if(currentVertex["parent"] == null) continue;

      graphWidget.addEdge(parentVertex["vertexClassNumber"], currentVertex["vertexClassNumber"], currentVertex["vertexClassNumber"], EDGE_TYPE_UDE, 1, true);
    }

    amountVertex = 5;

  }

  this.generateRandom = function(){
    
  }

  this.isAVL = function(bool){
    if(typeof bool != boolean) return;

    isAVL = bool;
  }

  this.search = function(vertexText){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    while(currentVertex != vertexText && currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;

      currentState["status"] = "Checking node " + currentVertex;
      currentState["lineNo"] = 3;
      stateList.push(currentState);

      if(parseInt(vertexText) > parseInt(currentVertex)) {
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = vertexText+" is greater than "+currentVertex;
        currentState["lineNo"] = 5;
        stateList.push(currentState);
        
        currentVertex = internalBst[currentVertex]["rightChild"];
        if(currentVertex == null) {
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
            currentState["status"] = "Node "+vertexText+" is not in the BST";
          currentState["lineNo"] = 2;
          stateList.push(currentState);
          break;
        }

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;

        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

        currentState["status"] = "So search on right";
        currentState["lineNo"] = 6;
        stateList.push(currentState);
      } else {
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = vertexText+" is less than "+currentVertex;
        currentState["lineNo"] = 7;
        stateList.push(currentState);
        
        currentVertex = internalBst[currentVertex]["leftChild"];
        if(currentVertex == null) {
          currentState = createState(internalBst, vertexTraversed, edgeTraversed);
          currentState["status"] = "Node "+vertexText+" is not in the BST";
          currentState["lineNo"] = 2;
          stateList.push(currentState);
          break;
        }

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
          edgeTraversed[edgeHighlighted] = true;

          currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
          currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

          currentState["status"] = "So search on left";
          currentState["lineNo"] = 7;
          stateList.push(currentState);
      }
    }

    if(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      currentState["status"] = "Found node " + vertexText;
      currentState["lineNo"] = 4;
      stateList.push(currentState);
    }
    // End state

    currentState = createState(internalBst);
    currentState["status"] = "Search is complete";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(4);
    return true;
  }

  this.findMin = function(){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
	var ans;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;

    stateList.push(currentState);

    if(currentVertex == null){
      currentState = createState(internalBst);
      currentState["status"] = "Tree is empty, there is no minimum value.";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
	  graphWidget.startAnimation(stateList);
	  return true;
    }

    while(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;

      if(internalBst[currentVertex]["leftChild"] != null){
        currentState["status"] = currentVertex+" is not the minimum value as it has a left child."
        currentState["lineNo"] = 2;
      }
      else{
		ans = currentVertex;
        currentState["status"] = "Minimum value found!"
        currentState["lineNo"] = 4;
      }

      currentVertex = internalBst[currentVertex]["leftChild"];

      stateList.push(currentState);

      if(currentVertex == null) break;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
      edgeTraversed[edgeHighlighted] = true;

      currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
      currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

      currentState["status"] = "Go left to check for smaller value..."
      currentState["lineNo"] = 3;

      stateList.push(currentState);
    }

    // End state

    currentState = createState(internalBst);
    currentState["status"] = "Find Min has ended. The minimum value is "+ans+".";
	currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(2);
    return true;
  }

  this.findMax = function(){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
	var ans;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;

    stateList.push(currentState);

    if(currentVertex == null){
      currentState = createState(internalBst);
      currentState["status"] = "Tree is empty, there is no maximum value.";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
	  graphWidget.startAnimation(stateList);
	  return true;
    }

    while(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;

      if(internalBst[currentVertex]["rightChild"] != null){
        currentState["status"] = currentVertex+" is not the maximum value as it has a right child."
        currentState["lineNo"] = 2;
      }
      else{
		ans = currentVertex;
        currentState["status"] = "Maximum value found!"
        currentState["lineNo"] = 4;
      }

      currentVertex = internalBst[currentVertex]["rightChild"];

      stateList.push(currentState);

      if(currentVertex == null) break;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
      edgeTraversed[edgeHighlighted] = true;

      currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
      currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

      currentState["status"] = "Go right to check for larger value..."
      currentState["lineNo"] = 3;

      stateList.push(currentState);
    }

    // End state

    currentState = createState(internalBst);
    currentState["status"] = "Find Max has ended. The maximum value is "+ans+".";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(1);
    return true;
  }

  this.inorderTraversal = function(){
    var stateList = [];
    var vertexTraversed = {};
    var vertexHighlighted = {};
    var edgeTraversed = {};
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;

    stateList.push(currentState);

    if(internalBst["root"] == null){
      currentState = createState(internalBst);
      currentState["status"] = "Tree is empty.";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
	  return true;
    }

    else inorderTraversalRecursion(internalBst["root"]);

    currentState = createState(internalBst);
    currentState["status"] = "In-order traversal of the whole BST is complete.";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);

    function inorderTraversalRecursion(currentVertex){
      var currentVertexLeftChild = internalBst[currentVertex]["leftChild"];
      var currentVertexRightChild = internalBst[currentVertex]["rightChild"];
      var currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      if(currentVertexLeftChild != null){
        var currentVertexLeftChildClass = internalBst[currentVertexLeftChild]["vertexClassNumber"];

        vertexTraversed[currentVertex] = true;
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        inorderHighlightVertex();
        currentState["status"] = "Left child of "+currentVertex+" is not null...";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        edgeTraversed[currentVertexLeftChildClass] = true;
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["el"][currentVertexLeftChildClass]["animateHighlighted"] = true;
        inorderHighlightVertex();
        currentState["status"] = "So in-order traverse left child of "+currentVertex+".";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
        inorderTraversalRecursion(currentVertexLeftChild);
      }

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      vertexHighlighted[currentVertexClass] = true;
      inorderHighlightVertex();
      currentState["status"] = "Visit node "+currentVertex+".";
      currentState["lineNo"] = 3;
      stateList.push(currentState);

      if(currentVertexRightChild != null){
        var currentVertexRightChildClass = internalBst[currentVertexRightChild]["vertexClassNumber"];

        vertexTraversed[currentVertex] = true;
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        inorderHighlightVertex();
        currentState["status"] = "Right child of "+currentVertex+" is not null...";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        edgeTraversed[currentVertexRightChildClass] = true;
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["el"][currentVertexRightChildClass]["animateHighlighted"] = true;
        inorderHighlightVertex();
        currentState["status"] = "So in-order traverse right child of "+currentVertex+".";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
        inorderTraversalRecursion(currentVertexRightChild);
      }

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      if(currentVertex != internalBst["root"]) currentState["el"][currentVertexClass]["state"] = EDGE_HIGHLIGHTED;
      inorderHighlightVertex();
    
      currentState["status"] = "In-order traversal of "+currentVertex+" is complete";
      currentState["lineNo"] = 0;
      stateList.push(currentState);
    }

    function inorderHighlightVertex(){
      var key;

      for(key in vertexHighlighted){
        currentState["vl"][key]["state"] = VERTEX_HIGHLIGHTED; 
      }
    }
    populatePseudocode(3);
    return true;
  }

  this.insert = function(vertexText){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    // Check whether input is number
    if(isNaN(parseInt(vertexText))){
      $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
      return false;
    }

    // No duplicates allowed
    if(internalBst[vertexText] != null){
      $('#insert-err').html("No duplicate vertex allowed!");
      return false;
    }

    // Check range
    if(parseInt(vertexText) < valueRange[0] || parseInt(vertexText) > valueRange[1]){
      $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
      return false;
    }

    if(!checkNewHeight()){
      $('#insert-err').html("Sorry, this visualization can only support trees of maximum height " + maxHeightAllowed);
      return false;
    }

    function checkNewHeight(){
      var parentVertex = internalBst["root"];
      var heightCounter = 0;

      while(parentVertex != null){
        if(parentVertex < parseInt(vertexText)) parentVertex = internalBst[parentVertex]["rightChild"];
        else parentVertex = internalBst[parentVertex]["leftChild"];
        heightCounter++;
      }

      heightCounter++; // New vertex added will add new height

      if(heightCounter > maxHeightAllowed) return false;
      return true;
    }

    // Find parent
    while(currentVertex != vertexText && currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;

      currentState["status"] = "Looking for location to insert " + vertexText + " ...";
    currentState["lineNo"] = 3;

      stateList.push(currentState);

      var nextVertex;
      if(parseInt(vertexText) > parseInt(currentVertex)) nextVertex = internalBst[currentVertex]["rightChild"];
      else nextVertex = internalBst[currentVertex]["leftChild"];

      if(nextVertex == null) break;
      else currentVertex = nextVertex;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
      edgeTraversed[edgeHighlighted] = true;

      currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
      currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

      if(parseInt(vertexText) > parseInt(internalBst[currentVertex]["parent"])){
        currentState["status"] = vertexText + " is larger than " + internalBst[currentVertex]["parent"] + ", so go right.";
    currentState["lineNo"] = 5;
      }
      else{
        currentState["status"] = vertexText + " is smaller than " + internalBst[currentVertex]["parent"] + ", so go left.";
    currentState["lineNo"] = 4;
      }
      

      stateList.push(currentState);
    }

    // Begin insertion

    // First, update internal representation

    internalBst[parseInt(vertexText)] = {
      "leftChild": null,
      "rightChild": null,
      "vertexClassNumber": amountVertex
    };

    if(currentVertex != null){
      internalBst[parseInt(vertexText)]["parent"] = currentVertex;
      if(currentVertex < parseInt(vertexText)) internalBst[currentVertex]["rightChild"] = parseInt(vertexText);
      else internalBst[currentVertex]["leftChild"] = parseInt(vertexText);
    }

    else{
      internalBst[parseInt(vertexText)]["parent"] = null;
      internalBst["root"] = parseInt(vertexText);
    }

    amountVertex++;

    recalculatePosition();

    // Then, draw edge
    var newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];

    if(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = OBJ_HIDDEN;

      currentState["el"][newNodeVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][newNodeVertexClass]["animateHighlighted"] = true;

      currentState["status"] = "Location found! Inserting " + vertexText + " ...";
      currentState["lineNo"] = 1;

      stateList.push(currentState);

      edgeTraversed[newNodeVertexClass] = true;
    }

    // Lastly, draw vertex

    currentState = createState(internalBst, vertexTraversed, edgeTraversed);
    currentState["vl"][newNodeVertexClass]["state"] = EDGE_HIGHLIGHTED;

    currentState["status"] = vertexText + " has been inserted!"
    currentState["lineNo"] = 2;

    stateList.push(currentState);

    // End State
    currentState = createState(internalBst);
    currentState["status"] = "Insert " + vertexText + " has been completed."
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(0);
    return true;
  }

  this.insertArr = function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    // Check whether input is array
    if(Object.prototype.toString.call(vertexTextArr) != '[object Array]'){
      $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
      return false;
    }

    // Loop through all array values and...

    var tempInternalBst = deepCopy(internalBst); // Use this to simulate internal insertion
    
    for(i = 0; i < vertexTextArr.length; i++){
      var vt = parseInt(vertexTextArr[i]);

      // 1. Check whether value is number
      if(isNaN(vt)){
        $('#insert-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // 2. No duplicates allowed. Also works if more than one similar value are inserted
      if(tempInternalBst[vt] != null){
        $('#insert-err').html("No duplicate vertex allowed!");
        return false;
      }

      // 3. Check range
      if(parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]){
        $('#insert-err').html("Sorry, only values between " + valueRange[0] + " and " + valueRange[1] + " can be inserted.");
        return false;
      }

      // 4. Insert the node into temporary internal structure and check for height
      var parentVertex = tempInternalBst["root"];
      var heightCounter = 0;

      if(parentVertex == null){
        tempInternalBst["root"] = parseInt(vt);
        tempInternalBst[vt] = {
          "parent": null,
          "leftChild": null,
          "rightChild": null
        };
      }

      else{
        while(true){
          heightCounter++;
          if(parentVertex < vt){
            if(tempInternalBst[parentVertex]["rightChild"] == null) break;
            parentVertex = tempInternalBst[parentVertex]["rightChild"];
          }
          else{
            if(tempInternalBst[parentVertex]["leftChild"] == null) break;
            parentVertex = tempInternalBst[parentVertex]["leftChild"];
          }
        }

        if(parentVertex < vt) tempInternalBst[parentVertex]["rightChild"] = vt;
        else tempInternalBst[parentVertex]["leftChild"] = vt;

        tempInternalBst[vt] = {
          "parent": parentVertex,
          "leftChild":null,
          "rightChild": null
        }
      }

      heightCounter++; // New vertex added will add new height

      if(heightCounter > maxHeightAllowed){
        $('#insert-err').html("Sorry, this visualization can only support tree of maximum height " + maxHeightAllowed);
        return false;
      }
    }

    function checkNewHeight(){
      var parentVertex = tempInternalBst["root"];
      var heightCounter = 0;

      while(parentVertex != null){
        if(parentVertex < parseInt(vertexText)) parentVertex = tempInternalBst[parentVertex]["rightChild"];
        else parentVertex = tempInternalBst[parentVertex]["leftChild"];
        heightCounter++;
      }

      heightCounter++; // New vertex added will add new height

      if(heightCounter > maxHeightAllowed) return false;
      return true;
    }

    for(i = 0; i < vertexTextArr.length; i++){
      var vertexText = parseInt(vertexTextArr[i]);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Find parent
      while(currentVertex != vertexText && currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        vertexTraversed[currentVertex] = true;

        currentState["status"] = "Looking for location to insert " + vertexText + " ...";
      currentState["lineNo"] = 3;

        stateList.push(currentState);

        var nextVertex;
        if(parseInt(vertexText) > parseInt(currentVertex)) nextVertex = internalBst[currentVertex]["rightChild"];
        else nextVertex = internalBst[currentVertex]["leftChild"];

        if(nextVertex == null) break;
        else currentVertex = nextVertex;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;

        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

        if(parseInt(vertexText) > parseInt(internalBst[currentVertex]["parent"])){
          currentState["status"] = vertexText + " is larger than " + internalBst[currentVertex]["parent"] + ", so go right.";
      currentState["lineNo"] = 5;
        }
        else{
          currentState["status"] = vertexText + " is smaller than " + internalBst[currentVertex]["parent"] + ", so go left.";
      currentState["lineNo"] = 4;
        }
        

        stateList.push(currentState);
      }

      // Begin insertion

      // First, update internal representation

      internalBst[parseInt(vertexText)] = {
        "leftChild": null,
        "rightChild": null,
        "vertexClassNumber": amountVertex
      };

      if(currentVertex != null){
        internalBst[parseInt(vertexText)]["parent"] = currentVertex;
        if(currentVertex < parseInt(vertexText)) internalBst[currentVertex]["rightChild"] = parseInt(vertexText);
        else internalBst[currentVertex]["leftChild"] = parseInt(vertexText);
      }

      else{
        internalBst[parseInt(vertexText)]["parent"] = null;
        internalBst["root"] = parseInt(vertexText);
      }

      amountVertex++;

      recalculatePosition();

      // Then, draw edge
      var newNodeVertexClass = internalBst[parseInt(vertexText)]["vertexClassNumber"];

      if(currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["vl"][newNodeVertexClass]["state"] = OBJ_HIDDEN;

        currentState["el"][newNodeVertexClass]["state"] = EDGE_TRAVERSED;
        currentState["el"][newNodeVertexClass]["animateHighlighted"] = true;

        currentState["status"] = "Location found! Inserting " + vertexText + " ...";
        currentState["lineNo"] = 1;

        stateList.push(currentState);

        edgeTraversed[newNodeVertexClass] = true;
      }

      // Lastly, draw vertex

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["vl"][newNodeVertexClass]["state"] = EDGE_HIGHLIGHTED;

      currentState["status"] = vertexText + " has been inserted!"
      currentState["lineNo"] = 2;

      stateList.push(currentState);

      // End State
      currentState = createState(internalBst);
      currentState["status"] = "Insert " + vertexText + " has been completed."
      stateList.push(currentState);
    }

    graphWidget.startAnimation(stateList);
    populatePseudocode(0);
    return true;
  }

  this.remove = function(vertexText){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    // Find vertex
    while(currentVertex != vertexText && currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      vertexTraversed[currentVertex] = true;
      
      currentState["status"] = "Searching for node to remove";
      currentState["lineNo"] = 1;
      stateList.push(currentState);

      if(parseInt(vertexText) > parseInt(currentVertex)) currentVertex = internalBst[currentVertex]["rightChild"];
      else currentVertex = internalBst[currentVertex]["leftChild"];

      if(currentVertex == null) break;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
      edgeTraversed[edgeHighlighted] = true;

      currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
      currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

      currentState["status"] = "Searching for node to remove";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
    }

    if(currentVertex != null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      currentState["status"] = "Searching for node to remove";
      currentState["lineNo"] = 1;
      stateList.push(currentState);
    }

    // Vertex is not inside the tree
    else{
      currentState = createState(internalBst);
      currentState["status"] = "Node "+ vertexText +" is not in the BST";
      currentState["lineNo"] = 0;
      stateList.push(currentState);

      graphWidget.startAnimation(stateList);
      populatePseudocode(5);
      return true;
    }

    // Vertex found; begin deletion

    // Case 1: no child

    if(internalBst[currentVertex]["leftChild"] == null && internalBst[currentVertex]["rightChild"] == null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["status"] = "The node to be removed has no children";
      currentState["lineNo"] = 2;
      stateList.push(currentState);
    
      var parentVertex = internalBst[currentVertex]["parent"];

      if(parentVertex != null){
        if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = null;
        else internalBst[parentVertex]["leftChild"] = null;
      }

      else internalBst["root"] = null;

      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      delete internalBst[currentVertex];
      delete vertexTraversed[currentVertex];
      delete edgeTraversed[currentVertexClass];

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["status"] = "Remove leaf";
      currentState["lineNo"] = 3;
      stateList.push(currentState);
    }

    // Case 2: One child

    // Only right child

    else if(internalBst[currentVertex]["leftChild"] == null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["status"] = "The node to be removed has a right child only";
      currentState["lineNo"] = 4;
      stateList.push(currentState);
    
      var parentVertex = internalBst[currentVertex]["parent"];
      var rightChildVertex = internalBst[currentVertex]["rightChild"];

      if(parentVertex != null){
        if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = rightChildVertex;
        else internalBst[parentVertex]["leftChild"] = rightChildVertex;
      }

      else internalBst["root"] = rightChildVertex;

      internalBst[rightChildVertex]["parent"] = parentVertex;

      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
      delete internalBst[currentVertex];
      delete vertexTraversed[currentVertex];
      delete edgeTraversed[currentVertexClass];

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      if(parentVertex != null){
        currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
      }

      currentState["status"] = "Delete the node, and connect parent to right child";
      currentState["lineNo"] = 5;
      stateList.push(currentState);

      recalculatePosition();

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      if(parentVertex != null){
        currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
      }

      currentState["status"] = "Delete the node, and connect parent to right child";
      currentState["lineNo"] = 5;
      stateList.push(currentState);
    }

    // Only left child

    else if(internalBst[currentVertex]["rightChild"] == null){
    currentState = createState(internalBst, vertexTraversed, edgeTraversed);
    currentState["status"] = "The node to be removed has a left child only";
    currentState["lineNo"] = 4;
    stateList.push(currentState);
    
      var parentVertex = internalBst[currentVertex]["parent"];
      var leftChildVertex = internalBst[currentVertex]["leftChild"];

      if(parentVertex != null){
        if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = leftChildVertex;
        else internalBst[parentVertex]["leftChild"] = leftChildVertex;
      }

      else internalBst["root"] = leftChildVertex;

      internalBst[leftChildVertex]["parent"] = parentVertex;

      currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
      leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];
      delete internalBst[currentVertex];
      delete vertexTraversed[currentVertex];
      delete edgeTraversed[currentVertexClass];

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      if(parentVertex != null){
        currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
      }

      currentState["status"] = "Delete the node, and connect parent to left child";
      currentState["lineNo"] = 5;
      stateList.push(currentState);

      recalculatePosition();

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      
      if(parentVertex != null){
        currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
      }

      currentState["status"] = "Delete the node, and connect parent to left child";
      currentState["lineNo"] = 5;
      stateList.push(currentState);
    }
    
    // Case 3: two children

    else{
      var parentVertex = internalBst[currentVertex]["parent"];
      var leftChildVertex = internalBst[currentVertex]["leftChild"];
      var rightChildVertex = internalBst[currentVertex]["rightChild"];
      var successorVertex = internalBst[currentVertex]["rightChild"];
      var successorVertexClass = internalBst[successorVertex]["vertexClassNumber"];

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      currentState["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
      currentState["el"][successorVertexClass]["animateHighlighted"] = true;

      currentState["status"] = "Finding successor";
      currentState["lineNo"] = 6;
      stateList.push(currentState);

      edgeTraversed[successorVertexClass] = true;
      vertexTraversed[successorVertex] = true;

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      currentState["status"] = "Finding successor";
      currentState["lineNo"] = 6;
      stateList.push(currentState);

      while(internalBst[successorVertex]["leftChild"] != null){
        successorVertex = internalBst[successorVertex]["leftChild"];
        successorVertexClass = internalBst[successorVertex]["vertexClassNumber"];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
        currentState["el"][successorVertexClass]["animateHighlighted"] = true;

        currentState["status"] = "Finding successor";
        currentState["lineNo"] = 6;
        stateList.push(currentState);

        edgeTraversed[successorVertexClass] = true;
        vertexTraversed[successorVertex] = true;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["status"] = "Finding successor";
        currentState["lineNo"] = 6;
        stateList.push(currentState);
      }

      var successorParentVertex = internalBst[successorVertex]["parent"]
      var successorRightChildVertex = internalBst[successorVertex]["rightChild"];

      // Update internal representation
      if(parentVertex != null){
        if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = successorVertex;
        else internalBst[parentVertex]["leftChild"] = successorVertex;
      }

      else internalBst["root"] = successorVertex;

      internalBst[successorVertex]["parent"] = parentVertex;
      internalBst[successorVertex]["leftChild"] = leftChildVertex;

      internalBst[leftChildVertex]["parent"] = successorVertex;

      if(successorVertex != rightChildVertex){
        internalBst[successorVertex]["rightChild"] = rightChildVertex;
        internalBst[rightChildVertex]["parent"] = successorVertex;

        if(successorRightChildVertex != null){
          if(parseInt(successorParentVertex) < parseInt(successorVertex)) internalBst[successorParentVertex]["rightChild"] = successorRightChildVertex;
          else internalBst[successorParentVertex]["leftChild"] = successorRightChildVertex;

          internalBst[successorRightChildVertex]["parent"] = successorParentVertex;
        }

        else{
          if(parseInt(successorParentVertex) < parseInt(successorVertex)) internalBst[successorParentVertex]["rightChild"] = null;
          else internalBst[successorParentVertex]["leftChild"] = null;
        }
      }

      delete internalBst[currentVertex];
      delete vertexTraversed[currentVertex];
      delete edgeTraversed[currentVertexClass];

      if(parentVertex == null){
        delete edgeTraversed[successorVertexClass];
      }

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      var leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];

      currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

      if(parentVertex != null){
        var parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
        currentState["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
      }

      if(successorVertex != rightChildVertex){
        var rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
        currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

        if(successorRightChildVertex != null){
          var successorRightChildVertexClass = internalBst[successorRightChildVertex]["vertexClassNumber"];
          currentState["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }
      }

      currentState["status"] = "Replace deleted node with successor";
      currentState["lineNo"] = 6;
      stateList.push(currentState);

      recalculatePosition();

      currentState = createState(internalBst, vertexTraversed, edgeTraversed);

      leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];

      currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

      currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

      if(parentVertex != null){
        var parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
        currentState["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
      }

      if(successorVertex != rightChildVertex){
        var rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
        currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

        if(successorRightChildVertex != null){
          var successorRightChildVertexClass = internalBst[successorRightChildVertex]["vertexClassNumber"];
          currentState["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }
      }

      currentState["status"] = "Replace deleted node with successor";
      currentState["lineNo"] = 6;
      stateList.push(currentState);
    }

    currentState = createState(internalBst);
    currentState["status"] = "Removal completed";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    populatePseudocode(5);
    return true;
  }

  this.removeArr = function(vertexTextArr){
    var stateList = [];
    var vertexTraversed = {};
    var edgeTraversed = {};
    var currentVertex = internalBst["root"];
    var currentState = createState(internalBst);
    var currentVertexClass;
    var key;
    var i;

    currentState["status"] = "The current BST";
    currentState["lineNo"] = 0;
    stateList.push(currentState);

    if(Object.prototype.toString.call(vertexTextArr) != '[object Array]'){
      $('#remove-err').html("Please fill in a number or comma-separated array of numbers!");
      return false;
    }

    // Loop through all array values and...
    
    for(i = 0; i < vertexTextArr.length; i++){
      var vt = parseInt(vertexTextArr[i]);

      // Check whether value is number
      if(isNaN(vt)){
        $('#remove-err').html("Please fill in a number or comma-separated array of numbers!");
        return false;
      }

      // Other checks not required
    }

    for(i = 0; i < vertexTextArr.length; i++){
      var vertexText = parseInt(vertexTextArr[i]);

      // Re-initialization
      vertexTraversed = {};
      edgeTraversed = {};
      currentVertex = internalBst["root"];
      currentState = createState(internalBst);

      // Find vertex
      while(currentVertex != vertexText && currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        vertexTraversed[currentVertex] = true;
        
        currentState["status"] = "Searching for node to remove";
        currentState["lineNo"] = 1;
        stateList.push(currentState);

        if(parseInt(vertexText) > parseInt(currentVertex)) currentVertex = internalBst[currentVertex]["rightChild"];
        else currentVertex = internalBst[currentVertex]["leftChild"];

        if(currentVertex == null) break;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var edgeHighlighted = internalBst[currentVertex]["vertexClassNumber"];
        edgeTraversed[edgeHighlighted] = true;

        currentState["el"][edgeHighlighted]["animateHighlighted"] = true;
        currentState["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;

        currentState["status"] = "Searching for node to remove";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
      }

      if(currentVertex != null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["status"] = "Searching for node to remove";
        currentState["lineNo"] = 1;
        stateList.push(currentState);
      }

      // Vertex is not inside the tree
      else{
        currentState = createState(internalBst);
        currentState["status"] = "Node "+ vertexText +" is not in the BST";
        currentState["lineNo"] = 0;
        stateList.push(currentState);

        graphWidget.startAnimation(stateList);
        // populatePseudocode(5);
        continue;
      }

      // Vertex found; begin deletion

      // Case 1: no child

      if(internalBst[currentVertex]["leftChild"] == null && internalBst[currentVertex]["rightChild"] == null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = "The node to be removed has no children";
        currentState["lineNo"] = 2;
        stateList.push(currentState);
      
        var parentVertex = internalBst[currentVertex]["parent"];

        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = null;
          else internalBst[parentVertex]["leftChild"] = null;
        }

        else internalBst["root"] = null;

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["status"] = "Remove leaf";
        currentState["lineNo"] = 3;
        stateList.push(currentState);
      }

      // Case 2: One child

      // Only right child

      else if(internalBst[currentVertex]["leftChild"] == null){
        currentState = createState(internalBst, vertexTraversed, edgeTraversed);
        currentState["status"] = "The node to be removed has a right child only";
        currentState["lineNo"] = 4;
        stateList.push(currentState);
      
        var parentVertex = internalBst[currentVertex]["parent"];
        var rightChildVertex = internalBst[currentVertex]["rightChild"];

        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = rightChildVertex;
          else internalBst[parentVertex]["leftChild"] = rightChildVertex;
        }

        else internalBst["root"] = rightChildVertex;

        internalBst[rightChildVertex]["parent"] = parentVertex;

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        if(parentVertex != null){
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Delete the node, and connect parent to right child";
        currentState["lineNo"] = 5;
        stateList.push(currentState);

        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        if(parentVertex != null){
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Delete the node, and connect parent to right child";
        currentState["lineNo"] = 5;
        stateList.push(currentState);
      }

      // Only left child

      else if(internalBst[currentVertex]["rightChild"] == null){
      currentState = createState(internalBst, vertexTraversed, edgeTraversed);
      currentState["status"] = "The node to be removed has a left child only";
      currentState["lineNo"] = 4;
      stateList.push(currentState);
      
        var parentVertex = internalBst[currentVertex]["parent"];
        var leftChildVertex = internalBst[currentVertex]["leftChild"];

        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = leftChildVertex;
          else internalBst[parentVertex]["leftChild"] = leftChildVertex;
        }

        else internalBst["root"] = leftChildVertex;

        internalBst[leftChildVertex]["parent"] = parentVertex;

        currentVertexClass = internalBst[currentVertex]["vertexClassNumber"];
        leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];
        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        if(parentVertex != null){
          currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Delete the node, and connect parent to left child";
        currentState["lineNo"] = 5;
        stateList.push(currentState);

        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        
        if(parentVertex != null){
          currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        currentState["status"] = "Delete the node, and connect parent to left child";
        currentState["lineNo"] = 5;
        stateList.push(currentState);
      }
      
      // Case 3: two children

      else{
        var parentVertex = internalBst[currentVertex]["parent"];
        var leftChildVertex = internalBst[currentVertex]["leftChild"];
        var rightChildVertex = internalBst[currentVertex]["rightChild"];
        var successorVertex = internalBst[currentVertex]["rightChild"];
        var successorVertexClass = internalBst[successorVertex]["vertexClassNumber"];

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
        currentState["el"][successorVertexClass]["animateHighlighted"] = true;

        currentState["status"] = "Finding successor";
        currentState["lineNo"] = 6;
        stateList.push(currentState);

        edgeTraversed[successorVertexClass] = true;
        vertexTraversed[successorVertex] = true;

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["status"] = "Finding successor";
        currentState["lineNo"] = 6;
        stateList.push(currentState);

        while(internalBst[successorVertex]["leftChild"] != null){
          successorVertex = internalBst[successorVertex]["leftChild"];
          successorVertexClass = internalBst[successorVertex]["vertexClassNumber"];

          currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;

          currentState["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
          currentState["el"][successorVertexClass]["animateHighlighted"] = true;

          currentState["status"] = "Finding successor";
          currentState["lineNo"] = 6;
          stateList.push(currentState);

          edgeTraversed[successorVertexClass] = true;
          vertexTraversed[successorVertex] = true;

          currentState = createState(internalBst, vertexTraversed, edgeTraversed);

          currentState["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

          currentState["status"] = "Finding successor";
          currentState["lineNo"] = 6;
          stateList.push(currentState);
        }

        var successorParentVertex = internalBst[successorVertex]["parent"]
        var successorRightChildVertex = internalBst[successorVertex]["rightChild"];

        // Update internal representation
        if(parentVertex != null){
          if(parseInt(parentVertex) < parseInt(currentVertex)) internalBst[parentVertex]["rightChild"] = successorVertex;
          else internalBst[parentVertex]["leftChild"] = successorVertex;
        }

        else internalBst["root"] = successorVertex;

        internalBst[successorVertex]["parent"] = parentVertex;
        internalBst[successorVertex]["leftChild"] = leftChildVertex;

        internalBst[leftChildVertex]["parent"] = successorVertex;

        if(successorVertex != rightChildVertex){
          internalBst[successorVertex]["rightChild"] = rightChildVertex;
          internalBst[rightChildVertex]["parent"] = successorVertex;

          if(successorRightChildVertex != null){
            if(parseInt(successorParentVertex) < parseInt(successorVertex)) internalBst[successorParentVertex]["rightChild"] = successorRightChildVertex;
            else internalBst[successorParentVertex]["leftChild"] = successorRightChildVertex;

            internalBst[successorRightChildVertex]["parent"] = successorParentVertex;
          }

          else{
            if(parseInt(successorParentVertex) < parseInt(successorVertex)) internalBst[successorParentVertex]["rightChild"] = null;
            else internalBst[successorParentVertex]["leftChild"] = null;
          }
        }

        delete internalBst[currentVertex];
        delete vertexTraversed[currentVertex];
        delete edgeTraversed[currentVertexClass];

        if(parentVertex == null){
          delete edgeTraversed[successorVertexClass];
        }

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        var leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];

        currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

        if(parentVertex != null){
          var parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
          currentState["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        if(successorVertex != rightChildVertex){
          var rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

          if(successorRightChildVertex != null){
            var successorRightChildVertexClass = internalBst[successorRightChildVertex]["vertexClassNumber"];
            currentState["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          }
        }

        currentState["status"] = "Replace deleted node with successor";
        currentState["lineNo"] = 6;
        stateList.push(currentState);

        recalculatePosition();

        currentState = createState(internalBst, vertexTraversed, edgeTraversed);

        leftChildVertexClass = internalBst[leftChildVertex]["vertexClassNumber"];

        currentState["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;

        currentState["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

        if(parentVertex != null){
          var parentVertexClass = internalBst[parentVertex]["vertexClassNumber"];
          currentState["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
        }

        if(successorVertex != rightChildVertex){
          var rightChildVertexClass = internalBst[rightChildVertex]["vertexClassNumber"];
          currentState["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;

          if(successorRightChildVertex != null){
            var successorRightChildVertexClass = internalBst[successorRightChildVertex]["vertexClassNumber"];
            currentState["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          }
        }

        currentState["status"] = "Replace deleted node with successor";
        currentState["lineNo"] = 6;
        stateList.push(currentState);
      }

      currentState = createState(internalBst);
      currentState["status"] = "Removal completed";
      currentState["lineNo"] = 0;
      stateList.push(currentState);
    }

    graphWidget.startAnimation(stateList);
    populatePseudocode(5);
    return true;
  }

  this.rotateLeft = function(vertexText){

  }

  this.rotateRight = function(vertexText){

  }

  function init(initArr){
    var i;

    for(i = 0; i < initArr.length; i++){
      var parentVertex = internalBst["root"];
      var newVertex = parseInt(initArr[i]);

      if(parentVertex == null){
        internalBst["root"] = parseInt(newVertex);
        internalBst[newVertex] = {
          "parent": null,
          "leftChild": null,
          "rightChild": null,
          "vertexClassNumber": amountVertex
        };
      }

      else{
        while(true){
          if(parentVertex < newVertex){
            if(internalBst[parentVertex]["rightChild"] == null) break;
            parentVertex = internalBst[parentVertex]["rightChild"];
          }
          else{
            if(internalBst[parentVertex]["leftChild"] == null) break;
            parentVertex = internalBst[parentVertex]["leftChild"];
          }
        }

        if(parentVertex < newVertex) internalBst[parentVertex]["rightChild"] = newVertex;
        else internalBst[parentVertex]["leftChild"] = newVertex;

        internalBst[newVertex] = {
          "parent": parentVertex,
          "leftChild":null,
          "rightChild": null,
          "vertexClassNumber": amountVertex
        }
      }

      amountVertex++;
    }

    recalculatePosition();

    for(key in internalBst){
      if(key == "root") continue;
      gw.addVertex(internalBst[key]["cx"], internalBst[key]["cy"], key, internalBst[key]["vertexClassNumber"], true);
    }

    for(key in internalBst){
      if(key == "root") continue;
      if(key == internalBst["root"]) continue;
      var parentVertex = internalBst[key]["parent"];
      gw.addEdge(internalBst[parentVertex]["vertexClassNumber"], internalBst[key]["vertexClassNumber"], internalBst[key]["vertexClassNumber"], EDGE_TYPE_UDE, 1, true);
    }
  }

  function clearScreen(){
    var key;

    for(key in internalBst){
      if(key == "root") continue;
      gw.removeEdge(internalBst[key]["vertexClassNumber"]);
    }

    for(key in internalBst){
      if(key == "root") continue;
      gw.removeVertex(internalBst[key]["vertexClassNumber"]);
    }

    internalBst = {};
    internalBst["root"] = null;
    amountVertex = 0;
  }

  /*
   * internalBstObject: a JS object with the same structure of internalBst. This means the BST doen't have to be the BST stored in this class
   * vertexTraversed: JS object with the vertexes of the BST which are to be marked as traversed as the key
   * edgeTraversed: JS object with the edges of the BST which are to be marked as traversed as the key
   */

  function createState(internalBstObject, vertexTraversed, edgeTraversed){
    if(vertexTraversed == null || vertexTraversed == undefined || !(vertexTraversed instanceof Object))
      vertexTraversed = {};
    if(edgeTraversed == null || edgeTraversed == undefined || !(edgeTraversed instanceof Object))
      edgeTraversed = {};

    var state = {
      "vl":{},
      "el":{}
    };

    var key;
    var vertexClass;

    for(key in internalBstObject){
      if(key == "root") continue;

      vertexClass = internalBstObject[key]["vertexClassNumber"]

      state["vl"][vertexClass] = {};

      state["vl"][vertexClass]["cx"] = internalBstObject[key]["cx"];
      state["vl"][vertexClass]["cy"] = internalBstObject[key]["cy"];
      state["vl"][vertexClass]["text"] = key;
      state["vl"][vertexClass]["state"] = VERTEX_DEFAULT;

      if(internalBstObject[key]["parent"] == null) continue;

      parentChildEdgeId = internalBstObject[key]["vertexClassNumber"];

      state["el"][parentChildEdgeId] = {};

      state["el"][parentChildEdgeId]["vertexA"] = internalBstObject[internalBstObject[key]["parent"]]["vertexClassNumber"];
      state["el"][parentChildEdgeId]["vertexB"] = internalBstObject[key]["vertexClassNumber"];
      state["el"][parentChildEdgeId]["type"] = EDGE_TYPE_UDE;
      state["el"][parentChildEdgeId]["weight"] = 1;
      state["el"][parentChildEdgeId]["state"] = EDGE_DEFAULT;
      state["el"][parentChildEdgeId]["animateHighlighted"] = false;
    }

    for(key in vertexTraversed){
      vertexClass = internalBstObject[key]["vertexClassNumber"];
      state["vl"][vertexClass]["state"] = VERTEX_TRAVERSED;
    }

    for(key in edgeTraversed){
      state["el"][key]["state"] = EDGE_TRAVERSED;
    }

    return state;
  }

  function recalculatePosition(){
    calcHeight(internalBst["root"], 0);
    updatePosition(internalBst["root"]);

    function calcHeight(currentVertex, currentHeight){
      if(currentVertex == null) return;
      internalBst[currentVertex]["height"] = currentHeight;
      calcHeight(internalBst[currentVertex]["leftChild"], currentHeight + 1);
      calcHeight(internalBst[currentVertex]["rightChild"], currentHeight + 1);
    }

    function updatePosition(currentVertex){
      if(currentVertex == null) return;

      if(currentVertex == internalBst["root"]) internalBst[currentVertex]["cx"] = MAIN_SVG_WIDTH/2;
      else{
        var i;
        var xAxisOffset = MAIN_SVG_WIDTH/2;
        var parentVertex = internalBst[currentVertex]["parent"]
        for(i = 0; i < internalBst[currentVertex]["height"]; i++){
          xAxisOffset /= 2;
        }

        if(parseInt(currentVertex) > parseInt(parentVertex))
          internalBst[currentVertex]["cx"] = internalBst[parentVertex]["cx"] + xAxisOffset;
        else internalBst[currentVertex]["cx"] = internalBst[parentVertex]["cx"] - xAxisOffset;
      }

      internalBst[currentVertex]["cy"] = 50 + 50*internalBst[currentVertex]["height"];

      updatePosition(internalBst[currentVertex]["leftChild"]);
      updatePosition(internalBst[currentVertex]["rightChild"]);
    }
  }
  
  function populatePseudocode(act) {
    switch (act) {
      case 0: // Insert
        document.getElementById('code1').innerHTML = 'if found insertion point';
        document.getElementById('code2').innerHTML = '&nbsp&nbspcreate new node';
        document.getElementById('code3').innerHTML = 'if value to be inserted < this key';
        document.getElementById('code4').innerHTML = '&nbsp&nbspgo left';
        document.getElementById('code5').innerHTML = 'else go right';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 1: // findMax
        document.getElementById('code1').innerHTML = 'if this is null return empty';
        document.getElementById('code2').innerHTML = 'if right != null';
        document.getElementById('code3').innerHTML = '&nbsp&nbspgo right';
        document.getElementById('code4').innerHTML = 'else return this key';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 2: // findMin
        document.getElementById('code1').innerHTML = 'if this is null return empty';
        document.getElementById('code2').innerHTML = 'else if left != null';
        document.getElementById('code3').innerHTML = '&nbsp&nbspgo left';
        document.getElementById('code4').innerHTML = 'else return this key';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 3: // in-order traversal
        document.getElementById('code1').innerHTML = 'if this is null return';
        document.getElementById('code2').innerHTML = 'inOrder(left)';
        document.getElementById('code3').innerHTML = 'visit this';
        document.getElementById('code4').innerHTML = 'inOrder(right)';
        document.getElementById('code5').innerHTML = '';
        document.getElementById('code6').innerHTML = '';
        document.getElementById('code7').innerHTML = '';
        break;
    case 4: // search
        document.getElementById('code1').innerHTML = 'if this == null';
        document.getElementById('code2').innerHTML = '&nbsp;&nbsp;return null';
        document.getElementById('code3').innerHTML = 'else if key == v';
        document.getElementById('code4').innerHTML = '&nbsp;&nbsp;return this';
        document.getElementById('code5').innerHTML = 'else if key < v';
        document.getElementById('code6').innerHTML = '&nbsp;&nbsp;search right';
        document.getElementById('code7').innerHTML = 'else search left';
        break;
    case 5: // remove
        document.getElementById('code1').innerHTML = 'search for v';
        document.getElementById('code2').innerHTML = 'if v is a leaf';
        document.getElementById('code3').innerHTML = '&nbsp;&nbsp;delete leaf v';
        document.getElementById('code4').innerHTML = 'else if v has 1 child';
        document.getElementById('code5').innerHTML = '&nbsp;&nbsp;bypass v';
        document.getElementById('code6').innerHTML = 'else replace v with successor';
        document.getElementById('code7').innerHTML = '';
        break;
  }
  }
}