"""Account API endpoints."""

from flask import request
from sqlalchemy import func
from app.api import api_bp
from app.api.utils import success_response, error_response, validate_request_json
from app.models import db, Account, AccountType


@api_bp.route('/accounts', methods=['GET'])
def get_accounts():
    """Get all active accounts grouped by type."""
    accounts_by_type = {}

    for account_type in AccountType:
        accounts = db.session.execute(
            db.select(Account).where(
                Account.is_active,
                Account.type == account_type
            )
        ).scalars().all()

        accounts_by_type[account_type.value.lower()] = [
            account.to_dict() for account in accounts
        ]

    return success_response(data=accounts_by_type)


@api_bp.route('/accounts', methods=['POST'])
@validate_request_json(['name', 'type'])
def create_account():
    """Create new account."""
    data = request.get_json()
    account_name = data['name']
    account_type_str = data['type']

    try:
        account_type = AccountType[account_type_str.upper()]
    except KeyError:
        return error_response('Invalid account type', 'INVALID_ACCOUNT_TYPE', 400)

    existing_account = Account.query.filter(
        func.lower(Account.name) == func.lower(account_name),
        Account.is_active
    ).first()

    if existing_account:
        return error_response('Account with this name already exists', 'DUPLICATE_ACCOUNT', 400)

    new_account = Account(account_name=account_name, account_type=account_type)

    try:
        db.session.add(new_account)
        db.session.commit()
        return success_response(
            data=new_account.to_dict(),
            message='Account created successfully',
            status=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f'Error creating account: {str(e)}', 'DATABASE_ERROR', 500)


@api_bp.route('/accounts/<int:account_id>', methods=['PATCH'])
@validate_request_json(['name'])
def update_account(account_id):
    """Update account name."""
    account = Account.query.get_or_404(account_id)

    if not account.is_active:
        return error_response('Account not found', 'NOT_FOUND', 404)

    data = request.get_json()
    new_name = data['name']

    if account.name == new_name:
        return success_response(
            data=account.to_dict(),
            message='Account unchanged'
        )

    existing_account = Account.query.filter(
        func.lower(Account.name) == func.lower(new_name),
        Account.is_active
    ).first()

    if existing_account:
        return error_response(
            f"Account with the name '{new_name}' already exists",
            'DUPLICATE_ACCOUNT',
            400
        )

    account.name = new_name

    try:
        db.session.commit()
        return success_response(
            data=account.to_dict(),
            message='Account updated successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f'Error updating account: {str(e)}', 'DATABASE_ERROR', 500)


@api_bp.route('/accounts/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    """Soft delete account."""
    account = Account.query.get_or_404(account_id)

    if not account.is_active:
        return error_response('Account not found', 'NOT_FOUND', 404)

    account.is_active = False

    try:
        db.session.commit()
        return success_response(
            message=f'Account {account.name} successfully deleted'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(f'Error deleting account: {str(e)}', 'DATABASE_ERROR', 500)
