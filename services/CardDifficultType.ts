enum CardDifficultType {
  EASY,
  DONT_SURE,
  DONT_KNOW
}

export function getAllCardDifficultTypes(): CardDifficultType[] {
  return [
    CardDifficultType.EASY,
    CardDifficultType.DONT_SURE,
    CardDifficultType.DONT_KNOW
  ];
}

export const allCardDifficultTypesNames: Map<number, string> = new Map<number, string>(
  [
    [CardDifficultType.EASY, 'Знаю'],
    [CardDifficultType.DONT_SURE, 'Неуверенно'],
    [CardDifficultType.DONT_KNOW, 'Не знаю']
  ]
);

export default CardDifficultType;
