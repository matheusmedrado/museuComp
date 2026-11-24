# museuComp

**Timeline: Duvido!** é um jogo de cartas em português sobre a história da computação, para o Museu da Computação da FACOM-UFU.

Veja as [regras completas](REGRAS.md) para jogar nos modos Explorador e Hacker.
Para levar as regras à mesa, abra o [manual para imprimir](manual.html) pelo servidor local e escolha **Imprimir manual** em papel **A4** (duas páginas).

## Ver e imprimir o baralho

Na raiz do repositório, execute `python3 -m http.server 8000` e abra
[http://localhost:8000/deck.html](http://localhost:8000/deck.html).
Não há dependências nem etapa de build. Clique na carta ou use **Virar carta** para conferir
o ano. Abra a [apresentação](index.html) para ver um resumo das regras e o protótipo original.

Em **Imprimir baralho**, escolha papel **A4**, escala **100%**, sem cabeçalhos e rodapés
e com gráficos de fundo. Para impressão frente e verso, use **virar pela borda longa**:
cada página de frentes é seguida pela página de versos com as colunas espelhadas.
Corte nos limites das cartas de 63 × 88 mm. Os créditos vêm ao final;
mantenha-os junto ao baralho impresso.

## Visual das cartas

O visual aprovado no Labs é usado nas 60 cartas, na tela e na impressão.
A frente traz imagem ditherizada, categoria, nome e dica, sem revelar o ano;
o verso traz só o ano como resposta, com a marca **Timeline: Duvido!** e o rodapé
**Museu da Computação**. Os dois modos usam o mesmo baralho: Bits podem ser
representados por tampinhas ou moedas; não são necessárias cartas de ação.

Frentes e versos são gerados pelos moldes `front` e `back` em `deck.html`,
preenchidos a partir de `cards.json` em `deck.js`. O Labs e seu comparador foram
retirados porque a proposta passou a ser o visual do baralho completo.
Na tela as cartas crescem com o texto; na impressão mantêm 63 × 88 mm, com a
imagem ajustada para acomodar a dica e os créditos sem ultrapassar o corte.

O logo fornecido pelo museu está em `img/museu-logo.png`. As cartas usam só seu símbolo,
recortado sem redesenho em `img/museu-symbol.png`, com transparência preservada e
branco aplicado por CSS para contrastar com o azul `#2E3192`. Ele fica na área de
texto, fora do retrato; a tipografia continua sem serifa. Para refazer o recorte
com ImageMagick (opcional, não necessário para abrir o baralho):

```sh
convert img/museu-logo.png -crop 1400x981+0+0 +repage -trim +repage img/museu-symbol.png
```

## Conteúdo

[cards.json](cards.json) reúne as 19 cartas da exportação revisada de Matheus e
41 novas cartas sobre a história da computação no Brasil e no mundo. Nas originais,
`verified` indica revisão contra a exportação; nas novas, indica a conferência do
ano do evento. O campo `source` registra os PNGs originais ou a fonte histórica
da nova carta. Os níveis de dificuldade ficam em branco.

O mesmo catálogo alimenta as versões de tela e de impressão. O campo `image` aponta
para uma cópia local de uma imagem livre do Wikimedia Commons, quando disponível.
O baralho ajusta o contraste e aplica dithering em três tons no navegador. Se não
houver imagem ou ela não carregar, a carta usa a ilustração SVG de reserva.
A lista de créditos em [deck.html](deck.html#creditos) vem de
[img/cards/credits.json](img/cards/credits.json).

Edite os dados em `cards.json`, as opções de dithering (`dither`) e as ilustrações
SVG em `deck.js`, e a aparência em `deck.css`. O catálogo e os moldes HTML podem
ser reaproveitados em uma futura versão jogável online.