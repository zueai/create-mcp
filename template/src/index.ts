import { WorkerEntrypoint } from "cloudflare:workers"
import { ProxyToSelf } from "workers-mcp"

export default class MyWorker extends WorkerEntrypoint<Env> {
	/**
	 * Gets n random programming jokes using the JokeAPI.
	 * @param n {number} the number of jokes to get.
	 * @return {Promise<any>} the response from the JokeAPI.
	 */
	async getJokes(n: number) {
		const url = new URL("https://v2.jokeapi.dev/joke/Programming")
		url.searchParams.set("amount", n.toString())

		const response = await fetch(url.toString())

		const data = await response.json()
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(data, null, 2)
				}
			]
		}
	}

	/**
	 * @ignore
	 **/
	async fetch(request: Request): Promise<Response> {
		return new ProxyToSelf(this).fetch(request)
	}
}
