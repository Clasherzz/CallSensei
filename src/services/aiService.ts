export async function explainEndpoint({ method, url, headers, body }: { method: string; url: string; headers: Record<string, string>; body: string; }): Promise<string> {
    // TODO: Replace with actual OpenAI API call
    return `This is a ${method} request to ${url}. Headers: ${JSON.stringify(headers)}. Body: ${body || 'none'}.`;
}

export async function explainResponse(response: { status: number; statusText: string; headers: Record<string, string>; body: string; }): Promise<string> {
    // TODO: Replace with actual OpenAI API call
    return `The response has status ${response.status} (${response.statusText}). Headers: ${JSON.stringify(response.headers)}. Body: ${response.body || 'none'}.`;
} 