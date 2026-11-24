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
Corte nos limites das cartas de 63 × 88 mm. A última página reúne os créditos;
mantenha-a junto ao baralho impresso.

## Labs

Em [Labs](deck.html#labs), a carta de Alan Turing mostra um estudo de frente e verso
mais limpo, com a mesma imagem ditherizada. Use **Comparar com a versão atual** para
alternar os dois visuais. O experimento usa os dados de `cards.json` e moldes próprios
em `deck.html`, com estilos isolados em `.labs-card` no `deck.css`; não altera as
19 cartas do baralho nem sua impressão. Para experimentar outra carta, troque o
identificador escolhido em `loadDeck()` no `deck.js`.
O logo fornecido pelo museu está em `img/museu-logo.png`. O Labs usa só seu símbolo,
recortado sem redesenho em `img/museu-symbol.png`, com transparência preservada e
branco aplicado por CSS para contrastar com o azul `#2E3192`. Ele fica na área de
texto, fora do retrato; a tipografia continua sem serifa. Para refazer o recorte
com ImageMagick (opcional, não necessário para abrir o baralho):

```sh
convert img/museu-logo.png -crop 1400x981+0+0 +repage -trim +repage img/museu-symbol.png
```

## Conteúdo

[cards.json](cards.json) contém as 19 cartas da exportação revisada de Matheus. Cada par
de PNGs de origem é identificado no catálogo. `verified` indica que o nome, o texto e o
ano foram conferidos contra essa exportação, não uma checagem histórica independente.
As categorias foram inferidas pelo tema das cartas; a exportação não atribui
dificuldade, por isso os níveis ficam em branco.

O mesmo catálogo alimenta as versões de tela e de impressão. O campo `image` de
cada carta aponta para uma imagem do Wikimedia Commons. O baralho ajusta o contraste
e aplica dithering em três tons no navegador; se uma imagem não carregar, a carta
usa sua ilustração SVG. A lista de créditos em [deck.html](deck.html#creditos) vem de
[img/cards/credits.json](img/cards/credits.json).

Edite os dados em `cards.json`, as opções de dithering (`dither`) e as ilustrações
SVG em `deck.js`, e a aparência em `deck.css`. O catálogo e os moldes HTML podem
ser reaproveitados em uma futura versão jogável online.