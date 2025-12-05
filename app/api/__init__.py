"""API Blueprint for JSON endpoints."""

from flask import Blueprint
from app.api.utils import error_response

api_bp = Blueprint('api', __name__)


@api_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return error_response('Resource not found', 'NOT_FOUND', 404)


@api_bp.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return error_response('Internal server error', 'INTERNAL_ERROR', 500)


from app.api import accounts, transactions
