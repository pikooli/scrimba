import openai from 'openai';

const model = 'gpt-3.5-turbo';
const baseURL= 'https://gateway.ai.cloudflare.com/v1/e89ce90d815f66ae65d909440bf79ab6/stock-prediction/openai';

  const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
  };

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			//  handle preflight request
			if (request.method === 'OPTIONS') {
				return new Response(null, { headers: corsHeaders });
			}
			if (request.method !== 'POST') {
				return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
			}

			const contentType = request.headers.get('Content-Type');
			let data = '';
			if (contentType?.includes('application/json')) {
				data = JSON.stringify(await request.json());
			}
			const client = new openai({
				apiKey: env.OPENAI_API_KEY,
				baseURL: baseURL,
			});
			const response = await client.chat.completions.create({
				model,
				messages: JSON.parse(data),
				temperature: 1.1,
			});
			const responseText = response.choices[0].message;
			return new Response(JSON.stringify(responseText), {
				headers: corsHeaders,
			});
		} catch (err) {
			console.error('error: ', err);
			return new Response(JSON.stringify({error: 'Unable to access AI. Please refresh and try again' + err}), {
				status: 500,
				headers: corsHeaders,
			});
		}
	},
} satisfies ExportedHandler<Env>;
