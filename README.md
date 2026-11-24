# museuComp

**Timeline** é um jogo de cartas em português sobre a história da computação, para o Museu da Computação da FACOM-UFU.

## Ver e imprimir o baralho

Na raiz do repositório, execute `python3 -m http.server 8000` e abra
[http://localhost:8000/deck.html](http://localhost:8000/deck.html).
Não há dependências nem etapa de build. Clique na carta ou use **Virar carta** para conferir
o ano. Abra a [apresentação](index.html) para ver as regras e o protótipo original.

Em **Imprimir baralho**, escolha papel **A4**, escala **100%**, sem cabeçalhos e rodapés
e com gráficos de fundo. Para impressão frente e verso, use **virar pela borda longa**:
cada página de frentes é seguida pela página de versos com as colunas espelhadas.
Corte nos limites das cartas de 63 × 88 mm. A última página reúne os créditos;
mantenha-a junto ao baralho impresso.

## Conteúdo

[cards.json](cards.json) contém as 19 cartas da exportação revisada de Matheus. Cada par
de PNGs de origem é identificado no catálogo. `verified` indica que o nome, o texto e o
ano foram conferidos contra essa exportação, não uma checagem histórica independente.
As categorias foram inferidas pelo tema das cartas; a exportação não atribui
dificuldade, por isso os níveis ficam em branco.

O mesmo catálogo alimenta as versões de tela e de impressão. O campo `image` de
cada carta aponta para uma imagem do Wikimedia Commons. O baralho ajusta o contraste
e aplica dithering em cinco tons no navegador; se uma imagem não carregar, a carta
usa sua ilustração SVG. A lista de créditos em [deck.html](deck.html#creditos) vem de
[img/cards/credits.json](img/cards/credits.json).

Edite os dados em `cards.json`, as opções de dithering (`dither`) e as ilustrações
SVG em `deck.js`, e a aparência em `deck.css`. O catálogo e os moldes HTML podem
ser reaproveitados em uma futura versão jogável online.