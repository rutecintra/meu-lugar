# 🚀 Deploy Configuration

## 📁 Arquivos de Configuração do Netlify

### `_redirects`
```
/*    /index.html   200
```
- **Propósito**: Redireciona todas as rotas para `index.html` com status 200
- **Solução**: Resolve o problema de "Page Not Found" em SPAs
- **Localização**: `public/_redirects` (copiado para `dist/_redirects`)

### `_headers`
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```
- **Propósito**: Configura headers de segurança
- **Localização**: `public/_headers` (copiado para `dist/_headers`)

### `netlify.toml`
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```
- **Propósito**: Configuração avançada do Netlify
- **Localização**: Raiz do projeto

## 🔧 Como Funciona

1. **Usuário acessa**: `meulugar.netlify.app/meu-lugar`
2. **Netlify verifica**: Arquivo `_redirects`
3. **Redireciona para**: `/index.html` com status 200
4. **React Router**: Intercepta e renderiza a rota correta
5. **Resultado**: Página carrega normalmente

## ✅ Teste das Rotas

Após o deploy, teste estas URLs:
- ✅ `meulugar.netlify.app/` (página inicial)
- ✅ `meulugar.netlify.app/meu-lugar` (criar lugar)
- ✅ `meulugar.netlify.app/mapa` (mapa das emoções)
- ✅ `meulugar.netlify.app/exploracao` (exploração sensorial)
- ✅ `meulugar.netlify.app/compare` (comparar lugares)
- ✅ `meulugar.netlify.app/quiz` (quiz de perfil)
- ✅ `meulugar.netlify.app/jogos` (jogos educativos)
- ✅ `meulugar.netlify.app/portfolio` (portfólio da turma)

## 🚨 Problemas Comuns

### "Page Not Found" ainda aparece
1. Verifique se `_redirects` está em `public/`
2. Faça novo build: `npm run build`
3. Verifique se `dist/_redirects` existe
4. Faça novo deploy no Netlify

### Rotas não funcionam após deploy
1. Aguarde alguns minutos (cache do Netlify)
2. Limpe cache do navegador
3. Teste em aba anônima
4. Verifique configurações do Netlify

## 📝 Notas Importantes

- **SPA**: Single Page Application precisa de redirecionamento
- **React Router**: Funciona apenas no cliente (browser)
- **Netlify**: Serve arquivos estáticos, não conhece rotas React
- **Solução**: Redirecionar todas as rotas para `index.html`
