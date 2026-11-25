# CompLine

**CompLine** é um jogo de cartas em português sobre a história da computação, para o Museu da Computação da FACOM-UFU.

Veja as [regras completas](REGRAS.md) para jogar nos modos Explorador e Hacker.
Para levar as regras à mesa, abra o [manual para imprimir](manual.html) pelo servidor local e escolha **Imprimir manual** em papel **A4** (duas páginas).

## Ver e imprimir o baralho

Na raiz do repositório, execute `python3 -m http.server 8000` e abra
[http://localhost:8000/deck.html](http://localhost:8000/deck.html).
Não há dependências nem etapa de build. Clique na carta ou use **Virar carta** para conferir
o ano. Abra o [site do jogo](index.html) para conhecer o projeto e aprender a jogar.
Use a busca e o filtro de categorias para explorar as cartas. A impressão sempre inclui o baralho completo.

O início é um desktop escuro inspirado no Macintosh clássico, com fundo liso e janela
centralizada na área útil e paleta azul, ciano e cinza da apresentação original.
Os ícones coloridos abrem o início, o baralho, o manual e a impressão
dentro do próprio sistema. No computador, arraste pela barra de título, expanda,
minimize ou feche as janelas; reabra-as pelos ícones. No celular, um
aplicativo ocupa a área de trabalho por vez, com rolagem dentro da janela.
Novas janelas formam uma pilha em escada, mantendo as anteriores à vista; janelas
arrastadas ficam onde você as deixou. As cartas do catálogo têm tamanho de leitura
limitado: expandir a janela acrescenta espaço e colunas, sem ampliar as cartas.
A tecla **Esc** fecha a janela ativa, inclusive quando o foco está no baralho ou manual.
Uma abertura de 1,8 segundo apresenta o sistema uma vez por aba, sem depender da rede;
**Pular abertura** ou **Esc** entram imediatamente. Links diretos e a preferência por
movimento reduzido pulam essa abertura. O início mostra três cartas reais se organizando
na linha do tempo; a animação termina e pode ser repetida pelo botão **↻**.
Com movimento reduzido, as cartas e seus anos aparecem diretamente na posição final.
Use **Imprimir** dentro do sistema para os arquivos completos; o comando de impressão
do navegador no desktop produz apenas um guia com links para o baralho e o manual.
Sem JavaScript, os textos do início e o manual continuam disponíveis.
O visual escuro é só da tela: o manual mantém o papel claro na impressão e as cartas
continuam com o mesmo molde compartilhado entre tela e A4. Não há framework nem build.

Em **Imprimir baralho**, escolha papel **A4**, escala **100%**, sem cabeçalhos e rodapés
e com gráficos de fundo. Para impressão frente e verso, use **virar pela borda longa**:
cada página de frentes é seguida pela página de versos com as colunas espelhadas.
Corte nos limites das cartas de 63 × 88 mm. Os créditos vêm ao final;
mantenha-os junto ao baralho impresso.

Os documentos `deck.html` e `manual.html` são usados em janelas de mesma origem,
sem duplicar os dados nem os moldes. Continuam disponíveis diretamente, inclusive
para impressão. Links entre os aplicativos são encaminhados pelo desktop;
links de fontes e licenças externas abrem em outra aba. Fragmentos como
`index.html#baralho`, `#manual/bits-title` e os antigos links numéricos continuam úteis.

## Visual das cartas

O visual aprovado no Labs é usado nas 66 cartas, na tela e na impressão.
A frente traz imagem ditherizada, categoria, nome e dica, sem revelar o ano;
o verso traz só o ano como resposta, com a marca **CompLine** e o rodapé
**Museu da Computação**. Os dois modos usam o mesmo baralho: Bits podem ser
representados por tampinhas ou moedas; não são necessárias cartas de ação.

Frentes e versos são gerados pelos moldes compartilhados em `cards.js`,
preenchidos a partir de `cards.json` em `deck.js` e na amostra de `home.js`. O Labs e seu comparador foram
retirados porque a proposta passou a ser o visual do baralho completo.
Na tela as cartas crescem com o texto; na impressão mantêm 63 × 88 mm, com a
imagem ajustada para acomodar a dica e os créditos sem ultrapassar o corte.

O site usa a marca **CompLine**, uma junção de computação e linha do tempo com um
aceno a *compiler*. O wordmark do site, do manual e das cartas usa
[Array, de Frode Helland](https://www.fontshare.com/fonts/array), carregada pela API
oficial do Fontshare sob a [licença ITF FFL](https://www.fontshare.com/licenses/itf-ffl).
Os arquivos da fonte não são redistribuídos no repositório; a primeira carga precisa
de conexão com o Fontshare. O corpo do texto continua com fontes do sistema.
Os controles de impressão aguardam as fontes; as regras e o catálogo não mudaram.

A versão branca do logo enviada pelo museu está em `img/museu-logo-white.png`,
usada sem redesenho na barra do sistema e na janela Sobre.

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
47 novas cartas sobre a história da computação no Brasil e no mundo. Nas originais,
`verified` indica revisão contra a exportação; nas novas, indica a conferência do
ano do evento. O campo `source` registra os PNGs originais ou a fonte histórica
da nova carta. Os níveis de dificuldade ficam em branco.

O mesmo catálogo alimenta as versões de tela e de impressão. O campo `image` aponta
para uma cópia local de uma imagem livre ou cedida para uso no baralho, quando
disponível.
O baralho ajusta o contraste e aplica dithering em três tons no navegador. Se não
houver imagem ou ela não carregar, a carta usa a ilustração SVG de reserva.
A lista de créditos em [deck.html](deck.html#creditos) vem de
[img/cards/credits.json](img/cards/credits.json).

Edite os dados em `cards.json`, as opções de dithering (`dither`) e as ilustrações
SVG em `cards.js`, e a aparência das cartas em `cards.css`.
A aparência do site fica em `site.css` e os estilos de navegação do baralho e
impressão ficam em `deck.css`. O catálogo e os moldes HTML podem
ser reaproveitados em uma futura versão jogável online.

## Próximo capítulo: jogar no navegador

O jogo online **não está implementado**. O [plano da versão web](PLANO-WEB.md)
descreve o primeiro modo local, a arquitetura, as regras, os critérios de aceite e
as etapas até testar o jogo antes de imprimir, sem adicionar backend agora.