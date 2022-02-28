//Credit: https://github.com/HaysS/javascript-cs-fundamentals/blob/e1a0ebf9b97369f4cc3ac7e0c98c0bd3fd6890db/data-structures/tree.js
function Node(data) {
    this.data = data;
    this.children = [];
}

class Tree {
    constructor() {
        this.root = null;
    }

    add(data, toNodeData) {
        const node = new Node(data);
        // If the toNodeData arg is passed, find it. Otherwise, store null.
        const parent = toNodeData ? this.findBFS(toNodeData) : null;

        // Push new node to parent whose value matches toNodeData
        if(parent) {
            parent.children.push(node)
        } else {
            // If there's no parent, make this the root node
            if(!this.root)
                this.root = node;
            else
                return "Tried to store node as root when root already exists."
        }
    }

    findBFS(data) {
        const queue = [this.root];
        let _node = null;

        // Go thru every node in BFS
        this.traverseBFS((node) => {
            // Return match if found
            if(node.data === data) {
                _node = node;
            }
        })

        return _node;
    }

    traverseBFS(cb) {
        const queue = [this.root];

        if(cb)
            while(queue.length) {
                // Store current node & remove it from queue
                const node = queue.shift();

                cb(node)

                    // Push children of current node to end of queue
                    for(const child of node.children) {
                    queue.push(child);
                }
            }
    }
}

(function test() {
    let tree = new Tree()


    tree.add('Node1')
    tree.add('Node2', 'Node1')
    tree.add('Node3', 'Node1')

    console.log(tree.findBFS('Node1'))

    // tree.traverseBFS((node) => {console.log(node)})
})()