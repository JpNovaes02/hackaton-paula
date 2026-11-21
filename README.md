# Robótica na escola: site completo em HTML

Site estático (sem servidor, sem instalação). Abra `index.html` no navegador para testar.

## Estrutura
- `index.html`: página inicial (trilha, conquistas, nível e XP)
- `modulo-1.html` a `modulo-6.html`: uma página por missão
- `galeria.html`: projetos das turmas
- `glossario.html`: termos com busca
- `css/estilo.css`: visual de todo o site (cores nas variáveis no topo do arquivo)
- `js/script.js`: progresso salvo, quiz, conquistas e busca
- `img/`: coloque aqui as suas imagens

## Como preencher o conteúdo
1. Abra o módulo (por exemplo `modulo-2.html`) em um editor de texto (VS Code, Bloco de Notas...).
2. Procure os textos entre colchetes, como `[Escreva aqui a explicação ...]`, e troque pelo seu conteúdo.
3. Para colocar uma imagem: salve em `img/` e use `<img src="img/nome.jpg" alt="descrição da imagem">`.
4. Para um vídeo do YouTube: Compartilhar > Incorporar e cole o código no lugar do texto.
5. Para mudar a pergunta do quiz: edite o texto e deixe `data-certo="sim"` somente na alternativa correta.

## Como publicar de graça
- **Netlify**: acesse app.netlify.com/drop e arraste a pasta `robotica`.
- **GitHub Pages**: crie um repositório, envie os arquivos e ative Pages nas configurações.
- **Sem internet**: copie a pasta para um pendrive ou computador da escola e abra `index.html`. (As fontes do Google não carregam sem internet, mas o site continua legível.)

## Observações
- O progresso é salvo no navegador de cada aparelho. Se várias alunas usam o mesmo computador, ele será compartilhado. O botão "Apagar o meu progresso" fica no fim da página inicial.
- Na galeria, publique imagens de alunas somente com autorização dos responsáveis.
- Troque `COLE-AQUI-O-LINK-DO-FORMULARIO` em `galeria.html` pelo link de um Google Forms.
