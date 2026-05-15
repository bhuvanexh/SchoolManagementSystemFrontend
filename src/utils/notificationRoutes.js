const notificationRouteMap = {
  notice: () => '/notices',
  event: () => '/events',
  test: () => '/tests',
  result: () => '/tests',
  attendance: () => '/attendance',
};

export const getNotificationRoute = (type, referenceId) => {
  const routeBuilder = notificationRouteMap[type];
  return routeBuilder ? routeBuilder(referenceId) : '/';
};
