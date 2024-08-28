# Serviço de Leitura de Medidores


Este projeto é um serviço de back-end para gerenciar leituras individualizadas de consumo de água e gás, utilizando IA para processar imagens de medidores.


## Visão Geral do Projeto


O serviço é construído usando Node.js com TypeScript e utiliza a API Gemini para processamento de imagens. Ele oferece uma API REST para upload de imagens de medidores e armazena as leituras em um banco de dados MongoDB.


![image](https://github.com/user-attachments/assets/8f9167d3-aa68-4164-804f-c7ddbddc4420)



## Funcionalidades

1. **Upload de Imagem**: 
   - Endpoint: `POST /upload`
   - Recebe uma imagem em base64, código do cliente, data/hora da medição e tipo de medição (água ou gás).
   - Valida os dados de entrada.
   - Verifica se já existe uma leitura para o mês atual.

2. **Processamento de Imagem**:
   - Utiliza a API Gemini para extrair o valor numérico da leitura do medidor na imagem.

3. **Armazenamento de Dados**:
   - Salva as informações da leitura no banco de dados MongoDB.

4. **Resposta da API**:
   - Retorna um link temporário para a imagem, o valor da medição e um UUID único.

5. **Tratamento de Erros**:
   - Lida com casos de dados inválidos e leituras duplicadas.

## Tecnologias Utilizadas

- Node.js com TypeScript
- Express.js para API REST
- MongoDB para armazenamento de dados
- Docker para containerização
- API Gemini para processamento de imagens
- Jest para testes unitários

## Como Executar

1. Clone o repositório
2. Configure o arquivo `.env` com sua chave da API Gemini:
   ```
   GEMINI_API_KEY=<sua_chave_da_api_gemini>
   ```
3. Execute `docker-compose up --build`

O serviço estará disponível em `http://localhost:5000`.

## Testes

Execute `npm test` para rodar os testes unitários.

## Notas de Desenvolvimento

- O projeto utiliza o padrão MVC (Model-View-Controller).
- A validação de dados é realizada através de middlewares personalizados em `validationUtils.ts`.
- A integração com a API Gemini é feita através do serviço `geminiService.ts`.
- O tratamento de erros inclui respostas padronizadas para diferentes cenários.



o funcionamento e o fluxo do projeto com base nos arquivos fornecidos:
1. Inicialização:
O projeto é iniciado a partir do docker-compose.yml, que configura dois serviços: a aplicação Node.js e o MongoDB.
As variáveis de ambiente são configuradas, incluindo a conexão com o MongoDB e a chave da API Gemini.


2. Roteamento:
As rotas são definidas em src/routes/measureRoutes.ts.
A principal rota é POST /upload, que lida com o upload de imagens de medidores.
Fluxo de Upload de Imagem:
a. Recebimento da Requisição:
A requisição POST chega com os dados da imagem, código do cliente, data/hora da medição e tipo de medição.
b. Validação:
O middleware validateUploadRequest em src/utils/validationUtils.ts valida os dados de entrada:
Verifica se todos os campos obrigatórios estão presentes.
Valida o formato base64 da imagem.
Confirma se o tipo de medição é válido (WATER ou GAS).
c. Processamento no Controlador:
O controlador uploadImage em src/controllers/measureController.ts é acionado.
Verifica se já existe uma leitura para o mesmo cliente/tipo no mês atual.
Se existir, retorna um erro 409 (Conflito).
d. Processamento da Imagem:
Chama o serviço processImage de src/services/geminiService.ts.
Este serviço envia a imagem para a API Gemini para análise.
A API Gemini extrai o valor numérico da leitura do medidor.
Um URL temporário para a imagem é gerado.
e. Armazenamento dos Dados:
Cria uma nova instância do modelo Measure com os dados processados.
Salva a nova medição no banco de dados MongoDB.
f. Resposta:
Retorna uma resposta de sucesso (200 OK) com:
URL da imagem
Valor da medição
UUID único da medição

4. Tratamento de Erros:
Erros de validação resultam em respostas 400 (Bad Request).
Tentativas de leituras duplicadas resultam em respostas 409 (Conflict).
Erros internos ou de processamento resultam em respostas 500 (Internal Server Error).
Banco de Dados:
O MongoDB armazena as medições, permitindo consultas futuras e verificações de duplicidade.
Este fluxo garante que cada upload de imagem seja validado, processado pela IA para extrair a leitura, verificado quanto à duplicidade, e armazenado de forma segura, fornecendo uma resposta consistente ao cliente. O uso de Docker facilita a implantação e garante um ambiente consistente para a aplicação e o banco de dados


