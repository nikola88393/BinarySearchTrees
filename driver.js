//Function that sorts and remove dublicate values from an array;
function sortAndRemoveDuplicates(array) {
  let newArr = array.filter((item, index) => array.indexOf(item) === index);
  newArr.sort((a, b) => a - b);

  return newArr;
}

//factory function for creating nodes
function node(data = null, left = null, right = null) {
  return {
    data: data,
    left: left,
    right: right,
  };
}

function Tree(array) {
  //remove duplicate values and sort the input array
  const modifiedArray = sortAndRemoveDuplicates(array);

  //recursively build the tree of nodes
  const buildTree = (array, start = 0, end = array.length - 1) => {
    if (start > end) return null;
    let mid = Math.floor((start + end) / 2);
    let treeNode = node(array[mid]);

    treeNode.left = buildTree(array, start, mid - 1);
    treeNode.right = buildTree(array, mid + 1, end);

    return treeNode;
  };

  //set the root of the tree
  let root = buildTree(modifiedArray);

  //responsible for calling the recursive insert method
  const insert = (key) => {
    root = insertRec(key, root);
  };
  //insertin a value inside the tree
  const insertRec = (key, root) => {
    if (root == null) {
      root = node(key);
      return root;
    }

    if (key < root.data) root.left = insertRec(key, root.left);
    else if (key > root.data) root.right = insertRec(key, root.right);

    return root;
  };

  const deleteItem = (key, Root = root) => {
    // Base case
    if (Root === null) {
      return Root;
    }

    // Recursive calls for ancestors of
    // node to be deleted
    if (Root.data > key) {
      Root.left = deleteItem(key, Root.left);
      return Root;
    } else if (Root.data < key) {
      Root.right = deleteItem(key, Root.right);
      return Root;
    }

    // We reach here when Root is the node
    // to be deleted.

    // If one of the children is empty
    if (Root.left === null) {
      let temp = Root.right;
      delete Root;
      return temp;
    } else if (Root.right === null) {
      let temp = Root.left;
      delete Root;
      return temp;
    }

    // If both children exist
    else {
      let succParent = Root;

      // Find successor
      let succ = Root.right;
      while (succ.left !== null) {
        succParent = succ;
        succ = succ.left;
      }

      // Delete successor
      if (succParent !== Root) {
        succParent.left = succ.right;
      } else {
        succParent.right = succ.right;
      }

      // Copy Successor Data to Root
      Root.data = succ.data;

      // Delete Successor and return Root
      delete succ;
      return Root;
    }
  };

  //Fucntion that searches for a given value and returns the node with that value or null if not found
  const find = (value, Root = root) => {
    while (Root != null && Root.data != value) {
      if (Root.data > value) {
        Root = Root.left;
      } else {
        Root = Root.right;
      }
    }

    return Root;
  };

  //Function for breadth-frist traversal
  const levelOrder = (Root = root, cb) => {
    if (Root == null) return;

    let queue = [];
    let result = [];
    queue.push(Root);

    while (queue.length) {
      let currentNode = queue[0];
      result.push(currentNode.data);
      if (currentNode.left != null) queue.push(currentNode.left);
      if (currentNode.right != null) queue.push(currentNode.right);
      queue.shift();
    }

    return result;
  };

  //Functions for deptht first traversal
  const preOrder = (Root = root, result = [], cb) => {
    if (Root == null) return;

    result.push(Root.data);
    // console.log("Data: " + Root.data);
    preOrder(Root.left, result);
    preOrder(Root.right, result);

    return result;
  };
  const inOrder = (Root = root, result = [], cb) => {
    if (Root == null) return;

    inOrder(Root.left, result);
    result.push(Root.data);
    inOrder(Root.right, result);

    return result;
  };
  const postOrder = (Root = root, result = [], cb) => {
    if (Root == null) return;

    postOrder(Root.left, result);
    postOrder(Root.right, result);
    result.push(Root.data);

    return result;
  };
  //calculate the height of the tree from the root or from a given node
  const height = (Root = root) => {
    if (Root === null) {
      return -1;
    }

    const leftHeight = height(Root.left);
    const rightHeight = height(Root.right);

    // Return the maximum height of the left and right subtrees, plus 1 for the current node
    return Math.max(leftHeight, rightHeight) + 1;
  };

  //calculate the depth of a given node
  const depth = (value, Root = root) => {
    let result = 0;
    while (Root != null && Root.data != value) {
      if (Root.data > value) {
        Root = Root.left;
      } else {
        Root = Root.right;
      }
      result++;
    }

    return result;
  };
  //function to check if the tree is balanced
  const isBalanced = (Root = root) => {
    if (Root === null) {
      return true;
    }
    return (
      Math.abs(height(Root.left) - height(Root.right)) <= 1 &&
      isBalanced(Root.left) &&
      isBalanced(Root.right)
    );
  };

  //fucniton that rebalances the tree
  const rebalance = () => {
    let newArr = levelOrder(root);
    root = buildTree(sortAndRemoveDuplicates(newArr));
  };

  //print the tree in the console
  const prettyPrint = (node = root, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  return {
    buildTree,
    prettyPrint,
    insert,
    deleteItem,
    find,
    levelOrder,
    preOrder,
    inOrder,
    postOrder,
    height,
    depth,
    isBalanced,
    rebalance,
  };
}
let tree = Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
tree.prettyPrint();
tree.insert(12);
tree.insert(112);
tree.insert(2);
tree.insert(32);
tree.prettyPrint();
tree.deleteItem(12);
tree.deleteItem(112);
tree.deleteItem(2);
tree.deleteItem(32);
tree.prettyPrint();
tree.deleteItem(67);
tree.prettyPrint();
console.log(tree.find(31313));
console.log("Level order: " + tree.levelOrder());
console.log("Pre order: " + tree.preOrder());
console.log("In order: " + tree.inOrder());
console.log("Post order: " + tree.postOrder());
console.log("Height is : " + tree.height());
console.log("Height is : " + tree.height(tree.find(4)));
console.log("Depth is: " + tree.depth(4));
console.log("Is balanced: " + tree.isBalanced());
tree.insert(3);
tree.insert(4);
tree.insert(5);
tree.insert(6);
console.log("Is balanced: " + tree.isBalanced());
tree.prettyPrint();
tree.rebalance();
console.log("Is balanced: " + tree.isBalanced());
tree.prettyPrint();
