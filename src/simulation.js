import Strategy from './strategy.js';
import backtester from './backtester.js';

export default class Simulation {
  constructor(pricesByAsset, strategy, options = {}, context = {}) {
    if (!Array.isArray(pricesByAsset) || pricesByAsset.length === 0)
      throw new Error('invalid pricesByAsset');
    this.pricesByAsset = pricesByAsset;

    if (!(strategy instanceof Strategy))
      throw new Error('strategy not an instance of Strategy');
    this.strategy = strategy;

    strategy.validateOptions(options, pricesByAsset);
    this.options = options;

    strategy.validateContext(context, pricesByAsset);
    this.context = context;

    this.results = null;
  }
  run() {
    const [returns, weightsByAsset] = backtester(
      this.pricesByAsset,
      this.strategy.calcWeights,
      this.strategy.checkRebalance,
      this.options,
      this.context
    );
    this.results = { returns, weightsByAsset };
  }
}
