declare module '@vkontakte/vk-bridge' {
  export type ChangeFragmentResponse = {
    location: string;
  };
  /**
   * Map of types of request props of VK Bridge methods
   */
  /* eslint-disable @typescript-eslint/ban-types */
  export type RequestPropsMap = {
    VKWebAppSetSwipeSettings: { history: boolean };
    VKWebAppDisableSwipeBack: {};
    VKWebAppEnableSwipeBack: {};
    VKWebAppSetLocation: { location: string; replace_state?: boolean };
  };
  /**
   * Map of types of response data of VK Bridge methods
   */
  export type ReceiveDataMap = {
    VKWebAppChangeFragment: ChangeFragmentResponse;
    VKWebAppSetSwipeSettings: { result: true };
    VKWebAppDisableSwipeBack: { result: true };
    VKWebAppEnableSwipeBack: { result: true };
    VKWebAppSetLocation: { result: true };
  };
  type EventReceiveNames<
    T extends keyof RequestPropsMap,
    R extends string,
    F extends string,
    > = Record<T, { result: R; failed: F }>;
  /**
   * Map of event names.
   */
  export type ReceiveEventMap =
    EventReceiveNames<
      'VKWebAppSetSwipeSettings',
      'VKWebAppSetSwipeSettingsResult',
      'VKWebAppSetSwipeSettingsFailed'
      > &
    EventReceiveNames<
      'VKWebAppDisableSwipeBack',
      'VKWebAppDisableSwipeBackResult',
      'VKWebAppDisableSwipeBackFailed'
      > &
    EventReceiveNames<
      'VKWebAppEnableSwipeBack',
      'VKWebAppEnableSwipeBackResult',
      'VKWebAppEnableSwipeBackFailed'
      > &
    EventReceiveNames<
      'VKWebAppSetLocation',
      'VKWebAppSetLocationResult',
      'VKWebAppSetLocationFailed'
      >;
  /**
   * Name of a method that can be sent.
   */
  export type AnyRequestMethodName = keyof RequestPropsMap;
  /**
   * Name of a method that can be received.
   */
  export type AnyReceiveMethodName = keyof ReceiveDataMap;
  /**
   * Name of a method that can be only received.
   */
  export type AnyReceiveOnlyMethodName = Exclude<AnyReceiveMethodName, AnyRequestMethodName>;
  /**
   * The name of the method that can be both sent and received.
   */
  export type AnyIOMethodName = AnyRequestMethodName & AnyReceiveMethodName;
  /**
   * Getter of failed event name of a method.
   */
  export type FailedResponseEventName<M extends AnyRequestMethodName> = M extends keyof ReceiveEventMap ? ReceiveEventMap[M]['failed'] : never;
  /**
   * Getter of result event name of a method.
   */
  export type ResultResponseEventName<M extends AnyRequestMethodName> = M extends keyof ReceiveEventMap ? ReceiveEventMap[M]['result'] : never;
  /**
   * Getter of request properties of a method.
   */
  export type RequestProps<M extends AnyRequestMethodName = AnyRequestMethodName> = RequestPropsMap[M];
  /**
   * Getter of response data of a method.
   */
  export type ReceiveData<M extends AnyReceiveMethodName> = ReceiveDataMap[M];
  /**
   * Property for matching sent request and received message.
   */
  export type RequestIdProp = {
    request_id?: number | string;
  };
  /**
   * Client error data.
   */
  export type ErrorDataClientError = {
    error_code: number;
    error_reason: string;
    error_description?: string;
  };
  /**
   * API error data.
   */
  export type ErrorDataAPIError = {
    error_code: number;
    error_msg: string;
    request_params: string[];
  };
  /**
   * Auth error data.
   */
  export type ErrorDataAuthError = {
    error_code: number;
    error_reason: string;
    error_description?: string[];
  };
  /**
   * Type of error data
   */
  export type ErrorData = {
    error_type: 'client_error';
    error_data: ErrorDataClientError;
    request_id?: number | string;
  } | {
    error_type: 'api_error';
    error_data: ErrorDataAPIError;
    request_id?: number | string;
  } | {
    error_type: 'auth_error';
    error_data: ErrorDataAuthError;
    request_id?: number | string;
  };
  /**
   * Generic event type for creating event types.
   */
  export type VKBridgeEventBase<Type extends string, Data> = {
    detail: {
      type: Type;
      data: Data;
    };
  };
  /**
   * Type of error event data
   */
  export type VKBridgeErrorEvent<M extends AnyReceiveMethodName> = VKBridgeEventBase<M extends AnyRequestMethodName ? FailedResponseEventName<M> : never, ErrorData>;
  /**
   * Type of event that is a response to a request
   */
  export type VKBridgeIOEvent<M extends AnyIOMethodName> = {
    [K in M]: VKBridgeEventBase<ResultResponseEventName<K>, ReceiveData<K> & RequestIdProp>;
  }[M];
  /**
   * Type of event that is not a response to a request
   */
  export type VKBridgeReceiveOnlyEvent<M extends AnyReceiveOnlyMethodName> = {
    [K in M]: VKBridgeEventBase<K, ReceiveData<K>>;
  }[M];
  /**
   * Type of result event data
   */
  export type VKBridgeResultEvent<M extends AnyReceiveMethodName> = M extends AnyReceiveOnlyMethodName ? VKBridgeReceiveOnlyEvent<M> : M extends AnyIOMethodName ? VKBridgeIOEvent<M> : never;
  /**
   * VK Bridge event.
   */
  export type VKBridgeEvent<M extends AnyReceiveMethodName> = VKBridgeErrorEvent<M> | VKBridgeResultEvent<M>;
  /**
   * Type of function that will be subscribed to VK Bridge events.
   */
  export type VKBridgeSubscribeHandler = (event: VKBridgeEvent<AnyReceiveMethodName>) => void;
  /**
   * Type of send function for methods that have props.
   *
   * @param method The method (event) name to send.
   * @param props Method properties.
   * @returns The Promise object with response data.
   */
  export type VKBridgeSend = <K extends AnyRequestMethodName>(method: K, props?: RequestProps<K> & RequestIdProp) => Promise<K extends AnyReceiveMethodName ? ReceiveData<K> : void>;
  /**
   * VK Bridge interface.
   */
  export class VKBridge {
    /**
     * Sends an event to the runtime env and returns the Promise object with
     * response data. In the case of Android/iOS application env is the
     * application itself. In the case of the browser, the parent frame in which
     * the event handlers is located.
     *
     * @param method The method (event) name to send.
     * @param [props] Method properties.
     * @returns The Promise object with response data.
     */
    send: VKBridgeSend;
    /**
     * Adds an event listener. It will be called any time a data is received.
     *
     * @param listener A callback to be invoked on every event receive.
     */
    subscribe: (listener: VKBridgeSubscribeHandler) => void;
    /**
     * Removes an event listener which has been subscribed for event listening.
     *
     * @param listener A callback to unsubscribe.
     */
    unsubscribe: (listener: VKBridgeSubscribeHandler) => void;
    /**
     * Checks if a method is supported on runtime platform.
     *
     * @param method Method (event) name to check.
     * @returns Result of checking.
     */
    supports: <K extends AnyRequestMethodName>(method: K) => boolean;
  }

  const bridge: VKBridge;
  export { bridge as default };
}
