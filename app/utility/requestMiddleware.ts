import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const conditionalBodyParser = (): MiddlewareObj<APIGatewayProxyEventV2> => ({
    before: async (request) => {
        const event = request.event;

        const method = event.requestContext?.http?.method?.toLowerCase();
        const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'];

        if (['post', 'put', 'patch'].includes(method || '') && contentType?.includes('application/json')) {
            if (event.body && typeof event.body === 'string') {
                try {
                    event.body = JSON.parse(event.body);
                } catch (error) {
                    console.error('Failed to parse JSON body', error);
                    throw new Error('Invalid JSON body');
                }
            }
        }
    }
});
