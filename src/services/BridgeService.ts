import bridge from '@vkontakte/vk-bridge';
import { createKey } from '../utils/utils';

export class BridgeService {
  private swipeBackConsumers: string[] = [];

  private static _instance: BridgeService | undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static enableNativeSwipeBack(): string {
    void bridge.send('VKWebAppSetSwipeSettings', { history: true });
    void bridge.send('VKWebAppEnableSwipeBack');
    const instance = BridgeService.instance;

    const consumerId = createKey();

    instance.swipeBackConsumers = [...instance.swipeBackConsumers, consumerId];

    return consumerId;
  }

  static disableNativeSwipeBack(consumerId: string) {
    const instance = BridgeService.instance;
    /**
     * Тот, кто попросил отключить нативный свайпбек, выходит из списка.
     */
    instance.swipeBackConsumers = instance.swipeBackConsumers.filter(
      (id) => id !== consumerId,
    );

    /**
     * Нативный свайпбек будет отключен только если больше не осталось тех, кому он нужен.
     */
    if (instance.swipeBackConsumers.length === 0) {
      void bridge.send('VKWebAppSetSwipeSettings', { history: false });
      void bridge.send('VKWebAppDisableSwipeBack');
    }
  }

  private static get instance(): BridgeService {
    if (!BridgeService._instance) {
      BridgeService._instance = new BridgeService();
    }
    return BridgeService._instance;
  }
}
