from flask import Flask, jsonify, request, render_template, redirect, url_for
from blockchain import Blockchain
from uuid import uuid4
import time 
from datetime import datetime
# Instantiate the Node
app = Flask(__name__)

@app.template_filter('datetime')
def format_datetime(timestamp):
    """Convert a timestamp to human-readable datetime format"""
    return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain()

@app.route('/')
def home():
    return redirect(url_for('index'))
 
@app.route('/index')
def index():
    return render_template('index.html',
                         blockchain=blockchain,
                         node_identifier=node_identifier)

@app.route('/mine', methods=['GET'])
def mine():
    # We run the proof of work algorithm to get the next proof...
    last_block = blockchain.last_block
    last_proof = last_block['proof']
    proof = blockchain.proof_of_work(last_proof)

    # We must receive a reward for finding the proof.
    blockchain.new_transaction(
        sender="0",
        recipient=node_identifier,
        amount=1,
    )

    # Forge the new Block by adding it to the chain
    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)

    return render_template('mine.html',
                         block=block,
                         node_identifier=node_identifier)

@app.route('/transactions/new', methods=['GET', 'POST'])
def new_transaction():
    if request.method == 'POST':
        values = request.form

        # Check that the required fields are in the POST'ed data
        required = ['sender', 'recipient', 'amount']
        if not all(k in values for k in required):
            return 'Missing values', 400

        # Create a new Transaction
        blockchain.new_transaction(values['sender'], values['recipient'], values['amount'])
        return redirect(url_for('transactions'))

    return render_template('transactions.html',
                         node_identifier=node_identifier)

@app.route('/transactions')
def transactions():
    return render_template('transactions.html',
                         transactions=blockchain.current_transactions,
                         node_identifier=node_identifier)

@app.route('/chain')
def full_chain():
    return render_template('chain.html',
                         chain=blockchain.chain,
                         node_identifier=node_identifier)

@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    values = request.get_json()

    nodes = values.get('nodes')
    if nodes is None:
        return "Error: Please supply a valid list of nodes", 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        'message': 'New nodes have been added',
        'total_nodes': list(blockchain.nodes),
    }
    return jsonify(response), 201

@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    replaced = blockchain.resolve_conflicts()

    if replaced:
        response = {
            'message': 'Our chain was replaced',
            'new_chain': blockchain.chain
        }
    else:
        response = {
            'message': 'Our chain is authoritative',
            'chain': blockchain.chain
        }

    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)