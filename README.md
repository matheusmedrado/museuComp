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
Corte nos limites das cartas de 63 × 88 mm.

## Conteúdo

[cards.json](cards.json) contém as 18 cartas citadas ou mostradas nos slides, não a lista
completa de cartas revisadas. `verified` indica se a combinação de nome e ano aparece na
apresentação, não uma checagem histórica independente. As datas de **Transistor** e
**Mouse de computador** são propostas e aparecem marcadas nos versos. As pistas,
categorias, níveis e ilustrações novas são material de protótipo.

O mesmo catálogo alimenta as versões de tela e de impressão. Edite os dados em
`cards.json`, as ilustrações SVG em `deck.js` e a aparência em `deck.css`;
o catálogo e os moldes HTML podem ser reaproveitados em uma futura versão jogável online.