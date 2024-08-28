import axios from 'axios';

interface ProcessedImageResponse {
image_url: string;
measure_value: number;
measure_uuid: string;
}

export const processImage = async (base64Image: string): Promise<ProcessedImageResponse> => {
try {
// Substitua pela URL da sua API de LLM
    const response = await axios.post('https://api.example.com/process-image', {
      image: base64Image,
});

// Assumindo que a resposta da API contém os dados esperados
    return {
image_url: response.data.image_url,
measure_value: response.data.measure_value,
measure_uuid: response.data.measure_uuid,
};
} catch (error) {
throw new Error('Erro ao processar a imagem com a API de LLM');
}
};
