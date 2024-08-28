import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

interface ProcessedImageResponse {
image_url: string;
measure_value: number;
}

export const processImage = async (imageBase64: string): Promise<ProcessedImageResponse> => {
try {
const response = await axios.post(
GEMINI_API_URL,
{
contents: [
{
parts: [
{ text: "Analyze this image and extract the meter reading value." },
{ inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] } }
]
}
]
},
{
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${GEMINI_API_KEY}`
}
}
);

// Processar a resposta da API Gemini
    const measureValue = extractMeasureValue(response.data);
const imageUrl = generateTemporaryImageUrl(imageBase64);

return {
image_url: imageUrl,
measure_value: measureValue,
};
} catch (error) {
console.error('Erro ao processar imagem com API Gemini:', error);
throw new Error('Erro ao processar imagem com API Gemini');
}
};

function extractMeasureValue(responseData: any): number {
// Implemente a lógica para extrair o valor da medição da resposta da API Gemini
  // Este é um exemplo simplificado, você precisará ajustar de acordo com a resposta real da API
  const text = responseData.candidates[0].content.parts[0].text;
const match = text.match(/\d+(\.\d+)?/);
return match ? parseFloat(match[0]) : 0;
}

function generateTemporaryImageUrl(base64Image: string): string {
// Implemente a lógica para gerar um URL temporário para a imagem
  // Este é um exemplo simplificado, você pode querer usar um serviço de armazenamento real
  return `https://example.com/temp-image/${Date.now()}.jpg`;
}
