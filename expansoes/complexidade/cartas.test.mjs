import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function readJson(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
}

const expansion = readJson('./cartas.json');
const timeline = new Map(readJson('../../cards.json').map(card => [card.id, card]));
const { characters, events, equipment, combos } = expansion;
const eventIds = new Set(events.map(event => event.id));

function assertUnique(ids) {
  assert.equal(new Set(ids).size, ids.length, ids.join(', '));
}

test('cada tipo tem IDs únicos e conteúdo para exibir', () => {
  for (const cards of [characters, events, equipment, combos]) {
    assert.ok(cards.length);
    assertUnique(cards.map(card => card.id));
    for (const { id, name, text } of cards) {
      assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(name?.trim() && text?.trim(), id);
    }
  }
});

test('Personagens e Equipamentos apontam para cartas da categoria certa', () => {
  for (const [cards, categories] of [
    [characters, ['Pessoa']],
    [equipment, ['Máquina', 'Componente']],
  ]) {
    assertUnique(cards.map(card => card.timelineCardId));
    for (const { id, timelineCardId, passive } of cards) {
      assert.ok(categories.includes(timeline.get(timelineCardId)?.category), id);
      assert.ok(passive.trigger && passive.effect?.type, id);
      for (const eventId of passive.conditions?.eventIds ?? []) {
        assert.ok(eventIds.has(eventId), eventId);
      }
    }
  }
});

test('há Personagens e cópias de Eventos para preparar uma partida cheia', () => {
  const maxPlayers = 4;
  const { startingEventCards, charactersPerPlayer } = expansion.setup;
  assert.ok(characters.length >= maxPlayers * charactersPerPlayer);
  assert.ok(startingEventCards <= expansion.eventRules.handLimit);
  let copies = 0;
  for (const event of events) {
    assert.ok(Number.isInteger(event.copies) && event.copies > 0, event.id);
    assert.ok(['challenger', 'active_player'].includes(event.actor), event.id);
    assert.ok(event.timing && event.effect?.type, event.id);
    if (event.effect.type === 'cancel_event') {
      assert.ok(eventIds.has(event.effect.eventId), event.effect.eventId);
      assert.notEqual(event.effect.eventId, event.id);
    }
    copies += event.copies;
  }
  assert.ok(copies >= maxPlayers * startingEventCards);
});

test('Combos são distintos e podem ser encaixados em ordem cronológica', () => {
  assertUnique(combos.map(combo => combo.timelineCardIds.join(',')));
  for (const { id, timelineCardIds } of combos) {
    assert.ok(timelineCardIds.length >= 2, id);
    assertUnique(timelineCardIds);
    let previousYear = -Infinity;
    for (const timelineId of timelineCardIds) {
      const year = timeline.get(timelineId)?.year;
      assert.ok(Number.isInteger(year) && year >= previousYear, `${id}: ${timelineId}`);
      previousYear = year;
    }
  }
});
