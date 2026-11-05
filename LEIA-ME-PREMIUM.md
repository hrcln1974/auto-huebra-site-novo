# Auto Elétrica Huebra — versão Premium

## O que foi atualizado
- Identidade visual mais clara, com acabamento premium e melhor contraste.
- Banner principal em destaque no início da página inicial, usando `img/banner.webp`.
- Galeria pública carregada a partir de `gallery.json`.
- Área administrativa com aba **Galeria de fotos e vídeos**:
  - adicionar fotos do computador;
  - alterar título e remover fotos;
  - cadastrar links de vídeos (YouTube, Instagram ou URL de MP4);
  - remover vídeos;
  - importar e exportar `gallery.json`.
- Mantidos catálogo, formulário, CRM local, vídeos e páginas existentes.
- Ícone de WhatsApp incluído em SVG para corrigir a referência de imagem ausente.

## Como acessar o painel
1. Abra `admin.html` no site publicado.
2. Senha inicial definida em `config.js`: `huebra2026`.
3. Altere `adminPass` em `config.js` antes de publicar.

## Como publicar novas fotos e vídeos
1. Entre no painel e abra **Galeria de fotos e vídeos**.
2. Adicione fotos e links de vídeos.
3. Clique em **Exportar gallery.json**.
4. Substitua o arquivo `gallery.json` na pasta do site pelo arquivo exportado.
5. Envie a pasta atualizada para a hospedagem.

**Atenção:** esta é uma hospedagem estática HTML/CSS/JS. O painel salva as alterações no armazenamento local do navegador usado pelo administrador. A exportação do `gallery.json` e o envio para a hospedagem são necessários para que todos os visitantes vejam as alterações. Fotos recém-enviadas são incorporadas ao JSON como dados; arquivos grandes podem gerar um JSON pesado. Prefira imagens WebP otimizadas.

## Segurança e limitações que precisam ser consideradas
O login atual usa uma senha em `config.js`, executada no navegador. Isso oferece apenas uma barreira visual e **não é autenticação segura**: alguém com conhecimento técnico pode visualizar a senha ou contornar a tela. Para proteger de verdade a área administrativa e permitir gravação direta no servidor, é necessário migrar o painel para backend (por exemplo, PHP + banco de dados ou API autenticada) ou configurar proteção HTTP Basic Auth no servidor.

O formulário de orçamento só envia para um serviço externo se `endpoint` em `config.js` estiver configurado. Sem endpoint, o fluxo atual mantém o lead apenas no navegador e redireciona para a página de confirmação. Para receber leads de todos os visitantes, configure um endpoint real e teste o recebimento.

## Testes realizados nesta entrega
- Sintaxe JavaScript com `node --check` nos scripts.
- Verificação de referências locais de imagens e arquivos.
- Validação de leitura do `gallery.json`.
- Verificação estrutural das páginas HTML.
- Teste automatizado de inclusão dos controles da galeria e IDs usados pelo script.

A publicação real, o envio de formulários para um serviço externo e a autenticação segura dependem das configurações da hospedagem e de serviços externos.
