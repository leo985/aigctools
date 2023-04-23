import type { APIRoute } from 'astro'

export const post: APIRoute = async(context) => {
  const bodyJson = await context.request.json()

  const url = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1'
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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',
      // 如果需要，添加您的授权令牌
      // 'Authorization': 'Bearer your_token'
    },
    body: JSON.stringify(bodyJson),
  }
  const response = await fetch(url, requestOptions)
  return response
}
