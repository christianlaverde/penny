"""API utility functions for response formatting and error handling."""

from flask import jsonify
from functools import wraps


def success_response(data=None, message=None, status=200):
    """Return standardized success response."""
    response = {
        'success': True,
    }
    if data is not None:
        response['data'] = data
    if message:
        response['message'] = message

    return jsonify(response), status


def error_response(error, code=None, status=400):
    """Return standardized error response."""
    response = {
        'success': False,
        'error': error
    }
    if code:
        response['code'] = code

    return jsonify(response), status


def validate_request_json(required_fields):
    """Decorator to validate required JSON fields in request."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            from flask import request

            if not request.is_json:
                return error_response('Request must be JSON', 'INVALID_CONTENT_TYPE', 400)

            data = request.get_json()
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return error_response(
                    f'Missing required fields: {", ".join(missing_fields)}',
                    'MISSING_FIELDS',
                    400
                )

            return f(*args, **kwargs)
        return decorated_function
    return decorator
