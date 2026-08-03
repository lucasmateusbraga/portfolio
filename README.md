# lucasbraga - portfolio

Site estático (HTML/CSS/JS puro, sem build step) pronto para publicar no GitHub Pages.

## Estrutura

```
index.html              -> a página inicial (única, com scroll)
css/styles.css           -> estilo da página inicial
js/script.js              -> menu mobile, scroll-spy, modal do case da BB, formulário
assets/img/               -> imagens usadas na página inicial
projetos/leapfone.html    -> página do case da Leapfone, com a identidade visual do site da Leapfone
projetos/smiles.html      -> página do case da Gol / Clube Smiles+, com a identidade visual do Clube Smiles+
```

Cada página de projeto é independente, com seu próprio HTML/CSS, para poder ter uma identidade visual distinta (inspirada no produto real que você desenhou), sem misturar estilos com a página inicial.

## Antes de publicar, 3 coisas para ajustar

1. **Formulário de contato (Formspree)**
   Crie uma conta grátis em [formspree.io](https://formspree.io), crie um formulário e copie o endpoint.
   Em `index.html`, troque:
   ```html
   <form class="contact-form reveal" action="https://formspree.io/f/SEU_FORM_ID" method="POST">
   ```
   por `action="https://formspree.io/f/xxxxxxx"` (o ID que o Formspree te der). Sem isso o formulário mostra um aviso e não envia.

2. **Link do LinkedIn e e-mail**
   Já estão preenchidos com `https://www.linkedin.com/in/mateuscruzb/` e `lucasmateuspessoal@gmail.com` em `index.html` (seção Sobre e rodapé). Só confirme que estão certos.

3. **Caso queira trocar as imagens**
   As fotos do case da BB estão em `assets/img/` (prefixo `bb-`). As imagens das páginas de Leapfone e Smiles+ são construídas em CSS/SVG (sem fotos externas), então não dependem de nenhum arquivo de imagem.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `lucasbraga.github.io` se quiser o domínio padrão `seunome.github.io`, ou qualquer nome se for usar um domínio próprio depois).
2. Suba todo o conteúdo desta pasta para a raiz do repositório (não dentro de uma subpasta).
3. No repositório: **Settings > Pages > Source: Deploy from a branch > Branch: main / (root)** e clique em Save.
4. Em 1 ou 2 minutos o site fica no ar em `https://seunome.github.io` (ou no domínio custom, se configurar um em Settings > Pages > Custom domain).

## Rodar localmente antes de publicar

Não precisa de nenhuma instalação, só abrir o `index.html` no navegador. Se quiser testar como vai rodar no servidor (recomendado, para o formulário e os caminhos das páginas de projeto funcionarem igual), na pasta do projeto rode:

```
python3 -m http.server 8000
```

e abra `http://localhost:8000`.
