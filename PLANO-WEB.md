# CompLine no navegador

**Status: plano, não implementação.** Este PR cuida do site e do material de
impressão. Nenhuma partida online, sala ou servidor de jogo é adicionado agora.

## Objetivo e primeiro recorte

Experimentar as regras antes de imprimir, com o mesmo catálogo e o mesmo visual
do jogo físico. Começar com **uma partida local, no mesmo dispositivo**, para
2 a 4 jogadores ou equipes, no modo Explorador. Um celular ou notebook no centro
da mesa já resolve: as mãos do jogo físico são públicas, só os anos ficam ocultos.
Não começar com contas, bots, chat ou multiplayer remoto.

O segundo incremento adiciona Hacker; a expansão Complexidade fica fora do MVP.
Todos os detalhes de regras vêm de [REGRAS.md](REGRAS.md), sem uma variante digital
silenciosa. Se uma situação não estiver definida, registrar a decisão antes de
codificar. Exemplo a explicitar: quantas vezes se pode Trocar antes de encaixar.

## Fluxo de uma partida

1. **Preparação.** Escolher modo, nomes e 2–4 jogadores/equipes; mostrar material e
   regras resumidas. Embaralhar; abrir a carta central; distribuir 5, 4 ou 3 cartas
   por mão, respectivamente, e 1 Bit para cada participante.
2. **Vez de jogar.** Mostrar jogador ativo, sua mão e a linha com os anos já
   revelados. Selecionar uma carta, ler a dica e escolher um intervalo, incluindo
   antes da primeira e depois da última. Oferecer botões de posição, não depender
   de arrastar. Confirmar sem revelar o ano.
3. **Desafio.** Pausar antes de virar. No Explorador, qualquer outro jogador pode
   registrar Duvido; como a mesa é presencial, ela identifica quem falou primeiro.
   No Hacker, só o próximo. Um botão explícito confirma que ninguém duvidou;
   sem cronômetro obrigatório. Não permitir trocar carta/posição após confirmar.
4. **Revelação e resultado.** Mostrar o ano, comparar com os vizinhos e explicar
   por que a posição está certa ou errada. Anos iguais aceitam qualquer ordem.
   Aplicar compras e Bits de forma atômica e só então passar o turno.
5. **Última rodada.** Ao esvaziar a primeira mão, marcar o gatilho. Cada outro
   participante joga uma última vez; encerrar quando a vez voltaria ao gatilho.
   Menos cartas vence; mais Bits desempata; empate total compartilha a vitória.
6. **Depois da partida.** Mostrar resultado, novas descobertas e os créditos;
   oferecer nova partida ou imprimir o baralho/manual. A galeria atual continua
   independente e identificada como galeria, não como partida.

## Regras que o motor precisa representar

| Situação | Resultado |
| --- | --- |
| Acerto sem desafio | Carta fica na linha. |
| Acerto com desafio | Desafiante compra 1; jogador ativo recebe 1 Bit. |
| Erro | Descartar a carta e comprar 1; desafiante, se houver, recebe 1 Bit. |
| Trocar (1 Bit) | Descartar 1 e comprar outra; excluir a recém-descartada do reembaralhamento. Sem outra disponível, não permitir. |
| Ano cravado | Registrar década no Explorador, ano exato no Hacker, antes da revelação. Acerto rende 1 Bit. |
| Criptografar (Hacker, 2 Bits) | Impedir o desafio somente neste turno; ainda conferir a posição. |
| Aposta dupla (Hacker) | Encaixar duas cartas ocultas e tratar como uma jogada. Ambas corretas: ficam, +1 Bit extra. Qualquer erro: descartar ambas e comprar 2. |
| Ano cravado + Aposta dupla | Registrar de qual das duas cartas é o palpite. |
| Monte esgotado | Reembaralhar descarte. Para cada carta de castigo ainda impossível de comprar, perder 1 Bit, sem saldo negativo. |

Na Aposta dupla, conferir a ordem final das duas cartas e da linha anterior,
sem revelar uma para ajudar a posicionar a outra. Custos, prêmios e castigos
devem ser aplicados uma única vez, mesmo com clique duplo ou retomada da página.

## Arquitetura proposta

- **Dados:** manter `cards.json` como catálogo único; usar `id` estável, sem
  duplicar datas nas telas. Acrescentar validação de IDs únicos, anos inteiros,
  campos obrigatórios e metadados de créditos antes de iniciar uma partida.
- **Motor puro:** módulo sem DOM com transições `preparação → escolha → desafio →
  revelação → resultado → próximo turno → fim`. Recebe estado e ação, devolve
  estado novo ou erro de jogada. Embaralhamento injetável para testes determinísticos.
- **Estado:** versão do formato, modo, seed/ordem do monte, descarte, linha,
  jogadores (`nome`, mão de IDs, Bits), jogador ativo, fase, jogada pendente,
  palpite, desafiante e gatilho da última rodada. Guardar IDs, não nós HTML ou
  cópias divergentes do catálogo. Registrar os efeitos já resolvidos por jogada.
- **Interface:** uma rota/página própria de jogo, responsiva e em pt-BR. Reusar
  `cards.js` e `cards.css` para desenho e dithering, com uma API que recebe
  explicitamente se o ano está revelado; a galeria tem controles próprios.
- **Persistência local:** salvar após cada transição em `localStorage`, com
  versão e verificação do catálogo. Oferecer retomar ou descartar com confirmação.
  Capturar armazenamento indisponível/cheio e continuar sem salvar, avisando.
- **Sem backend no MVP:** os anos estão no catálogo público. É suficiente para
  experimentar entre amigos, **não é proteção contra trapaça**. Para multiplayer
  remoto competitivo, decidir infraestrutura depois: servidor autoritativo,
  salas, reconexão, ordem dos desafios e revelação de anos pelo servidor.

Não adicionar framework nem serviço só para o plano. Na implementação, começar
com módulos ES e DOM como o site atual; reavaliar se a complexidade real justificar.

## Acessibilidade e uso no museu

- Teclado para selecionar cartas, intervalo, desafio e confirmação; foco levado
  ao próximo passo e anúncios curtos em `aria-live` para vez e resultado.
- Anos ocultos também fora da árvore acessível; não usar `title`, `alt` ou labels
  que entreguem respostas antes da revelação.
- Cor não é a única indicação de acerto/erro; texto e ícones acompanham o estado.
- Sem gesto obrigatório, animação longa ou limite de tempo para leitura.
- Linha longa com rolagem identificada e alternativa de lista/seleção de posição.
- Mesa confortável em 360 px e telas maiores; seguir `prefers-reduced-motion`.
- Manter autores, licenças e fontes acessíveis no jogo e na impressão.

## Etapas e critérios de aceite

1. **Motor + catálogo.** Testes unitários de preparação, posição inicial/final e
   intermediária, anos iguais, desafio certo/errado, compras, saldo mínimo,
   Trocar sem carta disponível e última rodada. Invariantes: nenhum ID perdido
   ou duplicado, linha ordenada, Bits não negativos e fase/participante válidos.
2. **Explorador local.** Fluxo completo para 2, 3 e 4 participantes, tela de ajuda,
   retomada e placar. Conseguir terminar uma partida só com teclado, em celular
   e desktop, sem que os anos apareçam antes da hora. Recarregar durante desafio
   e resultado não duplica compras nem revela anos indevidos.
3. **Hacker.** Custos, Criptografar, Ano cravado exato e Aposta dupla com testes de
   ambas certas, uma errada, ambas erradas, duas do mesmo ano e fim de monte.
4. **Validação na mesa.** Jogar uma partida de cada modo com colegas/monitor;
   registrar ambiguidades, ajustar a explicação e conferir correspondência entre
   manual, motor, dados e material impresso antes de anunciar como disponível.
5. **Só depois:** avaliar bots, expansão Complexidade, salas remotas e modo offline.
   Cada um exige um recorte próprio; não bloquear a primeira versão local por eles.

O MVP está pronto quando uma mesa consegue iniciar, retomar e concluir ambos os
modos sem árbitro externo para aplicar regras, com impressão ainda funcionando e
sem regressões nos créditos. O jogo local Explorador pode ser entregue primeiro,
claramente identificado como tal, antes de ampliar para Hacker.
