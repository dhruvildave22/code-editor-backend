const fs = require('fs');
const path = require('path');

const currentDir = __dirname;

function getRoutes() {
  const routes = [];
  const routesDir = fs.readdirSync(currentDir);

  // strictly match files ending with -routes.js
  const routeFileRegex = /-routes\.js$/;

  for (const file of routesDir) {
    if (!routeFileRegex.test(file)) {
      continue;
    }

    const fullPath = path.join(currentDir, file);
    const routeName = file.replace(routeFileRegex, '');

    routes.push({ filePath: fullPath, routeName });
  }

  return routes;
}

function registerRoutes(app, options = {}) {
  const { logger = console } = options;
  const routes = getRoutes();

  for (const route of routes) {
    const { filePath, routeName } = route;

    try {
      const router = require(filePath);

      if (!router) {
        logger.warn &&
          logger.warn(
            `Route module at ${filePath} did not export anything. Skipping.`
          );
        continue;
      }

      app.use(`/api/${routeName}`, router);
      logger.info &&
        logger.info(
          `Registered route /api/${routeName} -> ${filePath.replace(currentDir, '/routes')}`
        );
    } catch (err) {
      // Log an informative error and continue registering other routes
      logger.error &&
        logger.error(`Failed to register route from ${filePath}:`, err);
    }
  }
}

module.exports = registerRoutes;
