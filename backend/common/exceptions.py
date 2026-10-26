from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            'success': False,
            'error': {
                'status_code': response.status_code,
                'message': 'An error occurred processing your request',
                'details': response.data
            }
        }
        # Format field validation errors cleanly
        if isinstance(response.data, dict):
            first_err = next(iter(response.data.values()), None)
            if isinstance(first_err, list) and len(first_err) > 0:
                custom_data['error']['message'] = str(first_err[0])
            elif isinstance(first_err, str):
                custom_data['error']['message'] = first_err
        elif isinstance(response.data, list) and len(response.data) > 0:
            custom_data['error']['message'] = str(response.data[0])

        response.data = custom_data
    return response
