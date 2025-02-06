import openai from 'openai';

const model = 'gpt-3.5-turbo';

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

			const contentType = request.headers.get('Content-Type');
			let data = '';
			if (contentType?.includes('application/json')) {
				data = JSON.stringify(await request.json());
			}
			const client = new openai({
				apiKey: env.OPENAI_API_KEY,
			});
			const response = await client.chat.completions.create({
				model,
				messages: JSON.parse(data),
				temperature: 1.1,
			});
			const responseText = response.choices[0].message.content;
			return new Response(responseText, {
				headers: corsHeaders,
			});
		} catch (err) {
			console.error('error: ', err);
			return new Response('Unable to access AI. Please refresh and try again' + err, {
				headers: corsHeaders,
			});
		}
	},
} satisfies ExportedHandler<Env>;
