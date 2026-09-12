import { APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL;

export async function createArticle(
  request: APIRequestContext,
  token: string,
  article: { title: string; description: string; body: string; tagList: string[] }
) {
  const response = await request.post(`${API_BASE_URL}/articles`, {
    headers: { Authorization: `Token ${token}` },
    data: { article },
  });
  const json = await response.json();
  return json.article;
}

export async function deleteArticle(
  request: APIRequestContext,
  token: string,
  slug: string
) {
  await request.delete(`${API_BASE_URL}/articles/${slug}`, {
    headers: { Authorization: `Token ${token}` },
  });
}