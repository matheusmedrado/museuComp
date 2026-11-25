# CompLine — Complexidade

Expansão opcional de **2 a 4 jogadores ou equipes**, por cima do
[Modo Hacker](../../REGRAS.md). O baralho de CompLine, o ano como resposta e o
objetivo de esvaziar a mão continuam os mesmos.

## Preparar a mesa

1. Prepare a partida Hacker e defina a ordem dos turnos.
2. Na ordem inversa à dos turnos, cada jogador escolhe um **Personagem** diferente.
   Deixe-o à vista. Seu poder passivo vale desde o início, inclusive fora da sua vez
   quando a condição do poder for atendida.
3. Embaralhe o monte separado de **Eventos** e entregue um em segredo a cada jogador.
   Ponha os **Equipamentos** e os **Combos** à vista, fora da linha do tempo.

Para testar com o baralho impresso, faça fichas de papel com nome e efeito a partir
do [catálogo da expansão](cartas.json). Faça o número de cópias indicado para cada
Evento, com versos iguais, e uma ficha por Personagem, Equipamento e Combo.

## Sequência do turno

1. **Antes de encaixar:** você pode comprar um Evento por 1 Bit, uma vez neste
   turno. Não pague se já tiver dois Eventos ou se não houver de onde comprar.
   Faça as escolhas de Hacker, incluindo Trocar, Criptografar e Aposta dupla.
2. **Encaixe** sem virar. Se for usar Ano cravado, anuncie o palpite agora.
3. **Duvido!:** o próximo jogador pode passar ou duvidar, a menos que você tenha
   usado Criptografar. Ao duvidar, ele pode jogar **Bug**. Se alguém duvidou,
   você pode responder com **Patch**, ou com **Firewall** se houve Bug.
4. **Vire e confira a posição final.** Se quem duvidou errou, pode jogar **Backup**
   antes da compra de castigo. Aplique o resultado Hacker, com os ajustes dos
   Eventos, e então os poderes passivos que se aplicarem.
5. **Se acertou o encaixe**, receba os Combos formados e, depois, decida se vai
   instalar um Equipamento. Confira o fim de jogo após resolver o turno inteiro.

| Evento | O que muda |
| --- | --- |
| **Bug** | Se o encaixe estiver errado, quem encaixou compra uma carta de CompLine extra. |
| **Backup** | Evita a compra de castigo de quem duvidou e errou. Quem encaixou ainda ganha seu Bit. |
| **Patch** | Mude o encaixe de uma carta da jogada. Na Aposta dupla, não mova a outra carta. O palpite de Ano cravado não muda. |
| **Firewall** | Cancela o Bug, não o Duvido!. Ainda se aplicam os resultados Hacker. |

Cada pessoa pode jogar **um Evento por turno**, mesmo fora da própria vez.
Quem usou Bug não pode usar Backup no mesmo turno; quem responde a Bug precisa
escolher entre corrigir o encaixe com Patch e cancelar o Bug com Firewall. Em
Aposta dupla, Bug acrescenta só uma carta à compra total, não uma por encaixe;
se o monte de CompLine não puder cobrir uma compra de castigo, use a regra dos
Bits do Hacker.

Exemplo: alguém joga Bug contra sua Aposta dupla. Se você usar Firewall e um
encaixe estiver errado, compre duas cartas de CompLine, não três; quem duvidou
ainda ganha o Bit. Se usar Patch no lugar, o Bug só terá efeito se a jogada
continuar errada.

O limite é de **dois Eventos na mão**. Ignore compras de Evento que superem o
limite. Quando o monte de Eventos acabar, embaralhe apenas seu próprio descarte
para remontá-lo. Eventos usados ou cancelados vão para o descarte no fim do
turno. Se ainda não houver Evento para uma compra grátis, pule a compra. Quando
Tim Berners-Lee escolhe uma carta de Evento, reserve a primeira enquanto busca a
segunda; se só houver uma, fique com ela.

## Equipamentos

Ao encaixar corretamente uma carta de CompLine que tenha um Equipamento
correspondente, você pode pegar a ficha e instalá-la à sua frente. A carta de
CompLine **fica na linha**; a ficha não conta como carta na mão. A carta inicial
da partida não dá Equipamento a ninguém.

Você tem **um espaço**. Se já tiver um Equipamento, pode manter o atual ou
descartá-lo para instalar o novo; a ficha descartada não volta à partida. Mesmo
numa Aposta dupla, só pode instalar um Equipamento por turno. O novo poder
começa no fim do turno, então não vale no encaixe que o conquistou.

## Combos

Um Combo acontece quando suas cartas ficam lado a lado **na ordem indicada**,
com o encaixe certo e pelo menos uma delas vinda da sua jogada. Elas podem ter
anos iguais: ambas as ordens continuam certas para CompLine, mas só a ordem
indicada vale para o Combo. Não precisa ter sido você quem encaixou a outra carta.

Vire a ficha do Combo para marcar que ele foi usado. Quem o completa ganha
**1 Bit e compra 1 Evento** (se couber na mão). Cada Combo só rende uma vez
na partida, mesmo que deixe de estar lado a lado.

| Combo | Ordem da esquerda para a direita |
| --- | --- |
| **Máquina + algoritmo** | Charles Babbage → Ada Lovelace |
| **Do ENIAC ao EDVAC** | ENIAC → John von Neumann |
| **Do transistor ao chip** | Transistor → Circuito Integrado |

Exemplo: Babbage e Ada estão na sua mão. Aposte as duas no mesmo turno, encaixando
Ada logo depois de Babbage. Se as duas estiverem certas, ganhe o Bit da Aposta
dupla e, se o Combo ainda não saiu, também o Bit e o Evento do Combo.

## Dados para a versão online

O [catálogo](cartas.json) é versionado e usa os IDs de
[`cards.json`](../../cards.json) para referenciar CompLine. Os IDs de Personagem,
Evento, Equipamento e Combo têm escopos separados. Monte o baralho de Eventos
com o número de cópias declarado no catálogo; dê a cada cópia uma identidade
na partida. Use os gatilhos, atores, condições e efeitos estruturados para o
jogo; os campos `name`, `abilityName` e `text` são só para exibição.

O estado da expansão acompanha os Personagens escolhidos, a mão privada de
Eventos, monte e descarte de Eventos, o Equipamento público de cada jogador,
os Combos já usados e os limites do turno. As fichas não entram na mão de
CompLine nem no desempate. A expansão não altera a regra de vitória Hacker.

Valide o catálogo com `node --test expansoes/complexidade/cartas.test.mjs`.
Ainda não há integração com a versão web nem teste de equilíbrio em mesa.
