// Assuming the endpoint returns an API key in the following format:
// { "apiKey": "your_api_key_here" }

async function fetchApiKey(endpoint: string): Promise<string> {
    try {
        // Perform the HTTP GET request to the endpoint
        const response = await fetch(endpoint);
        if (!response.ok) {
            // If the response is not 2xx, throw an error
            throw new Error(`Error fetching API key: ${response.statusText}`);
        }
        // Parse the JSON body of the response
        const data = await response.json();
        // Return the API key
        return data.key;
    } catch (error) {
        // Log the error or handle it as needed
        console.error("Failed to fetch API key:", error);
        throw error; // Re-throw the error if you want calling code to handle it
    }
}

export default fetchApiKey;
