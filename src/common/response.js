export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

/**
 * Wrap plain/text or HTML responses with CORS headers
 * @param {BodyInit|null} body
 * @param {number} [status=200]
 * @param {Record<string,string>} [headers={}]
 */
export function withCors(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, ...headers }
  });
}

/**
 * JSON response helper with CORS
 * @param {any} data – serialisable JSON data
 * @param {number} [status=200]
 * @param {Record<string,string>} [headers={}]
 */
export function jsonResponse(data, status = 200, headers = {}) {
  return withCors(JSON.stringify(data), status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers
  });
}
