"""Transaction API endpoints."""

from flask import request
from datetime import datetime
from decimal import Decimal, InvalidOperation
from app.api import api_bp
from app.api.utils import success_response, error_response, validate_request_json
from app.models import db, Transaction


@api_bp.route('/transactions', methods=['GET'])
def get_transactions():
    """Get all active transactions, optionally filtered by account."""
    account_id = request.args.get('account_id', type=int)

    query = db.select(Transaction).where(Transaction.is_active)

    if account_id:
        query = query.where(
            (Transaction.debit_account_id == account_id) |
            (Transaction.credit_account_id == account_id)
        )

    transactions = db.session.execute(
        query.order_by(Transaction.date.desc())
    ).scalars().all()

    return success_response(
        data=[t.to_dict() for t in transactions]
    )


@api_bp.route('/transactions', methods=['POST'])
@validate_request_json(['description', 'date', 'amount', 'debitAccountId', 'creditAccountId'])
def create_transaction():
    """Create new transaction."""
    data = request.get_json()

    try:
        amount = Decimal(str(data['amount']))
    except (InvalidOperation, ValueError):
        return error_response('Amount must be a valid number', 'INVALID_AMOUNT', 400)

    try:
        date = datetime.fromisoformat(data['date'].replace('Z', '+00:00')).date()
    except ValueError:
        return error_response('Invalid date format', 'INVALID_DATE', 400)

    debit_account_id = data['debitAccountId']
    credit_account_id = data['creditAccountId']

    if debit_account_id == credit_account_id:
        return error_response(
            'Debit and credit accounts cannot be the same',
            'SAME_ACCOUNTS',
            400
        )

    new_transaction = Transaction(
        description=data['description'],
        date=date,
        amount=amount,
        debit_account_id=debit_account_id,
        credit_account_id=credit_account_id
    )

    try:
        db.session.add(new_transaction)
        db.session.commit()
        return success_response(
            data=new_transaction.to_dict(),
            message='Transaction created successfully',
            status=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f'Error creating transaction: {str(e)}', 'DATABASE_ERROR', 500)


@api_bp.route('/transactions/<int:transaction_id>', methods=['PATCH'])
@validate_request_json(['description', 'date', 'amount', 'debitAccountId', 'creditAccountId'])
def update_transaction(transaction_id):
    """Update transaction."""
    transaction = Transaction.query.get_or_404(transaction_id)

    if not transaction.is_active:
        return error_response('Transaction not found', 'NOT_FOUND', 404)

    data = request.get_json()

    try:
        amount = Decimal(str(data['amount']))
    except (InvalidOperation, ValueError):
        return error_response('Amount must be a valid number', 'INVALID_AMOUNT', 400)

    try:
        date = datetime.fromisoformat(data['date'].replace('Z', '+00:00')).date()
    except ValueError:
        return error_response('Invalid date format', 'INVALID_DATE', 400)

    debit_account_id = data['debitAccountId']
    credit_account_id = data['creditAccountId']

    if debit_account_id == credit_account_id:
        return error_response(
            'Debit and credit accounts cannot be the same',
            'SAME_ACCOUNTS',
            400
        )

    transaction.description = data['description']
    transaction.date = date
    transaction.amount = amount
    transaction.debit_account_id = debit_account_id
    transaction.credit_account_id = credit_account_id

    try:
        db.session.commit()
        return success_response(
            data=transaction.to_dict(),
            message='Transaction updated successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f'Error updating transaction: {str(e)}', 'DATABASE_ERROR', 500)


@api_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Soft delete transaction."""
    transaction = Transaction.query.get_or_404(transaction_id)

    if not transaction.is_active:
        return error_response('Transaction not found', 'NOT_FOUND', 404)

    transaction.is_active = False

    try:
        db.session.commit()
        return success_response(
            data={
                'debitAccount': {
                    'id': transaction.debit_account.id,
                    'balance': float(transaction.debit_account.get_balance())
                },
                'creditAccount': {
                    'id': transaction.credit_account.id,
                    'balance': float(transaction.credit_account.get_balance())
                }
            },
            message='Transaction deleted successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f'Error deleting transaction: {str(e)}', 'DATABASE_ERROR', 500)
