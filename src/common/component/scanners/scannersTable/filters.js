const marketCapZeroTo500cr = [
  {
    _and: [{ market_cap: { _gte: 0 } }, { market_cap: { _lte: 5000000000 } }],
  },
];
const marketCap500To2500cr = [
  {
    _and: [
      {
        market_cap: { _gte: 5000000000 },
      },
      { market_cap: { _lte: 25000000000 } },
    ],
  },
];
const marketCap2500To10kcr = [
  {
    _and: [
      {
        market_cap: { _gte: 25000000000 },
      },
      { market_cap: { _lte: 100000000000 } },
    ],
  },
];
const marketCap10kTo25kcr = [
  {
    _and: [
      { market_cap: { _gte: 100000000000 } },
      { market_cap: { _lte: 250000000000 } },
    ],
  },
];
const marketCap25kcrAbove = [
  { _and: [{ market_cap: { _gte: 250000000000 } }] },
];
const marketCapAll = [
  { market_cap: { _gte: 0 } },
  { market_cap: { _is_null: true } },
];
export {
  marketCapZeroTo500cr,
  marketCap500To2500cr,
  marketCap2500To10kcr,
  marketCap10kTo25kcr,
  marketCap25kcrAbove,
  marketCapAll,
};
