import { TODAY, getSlotsByDate } from './database.js';

const DELAY_MS = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export function mockApiPlugin() {
  return {
    name: 'boroda-mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        await delay(DELAY_MS);

        if (req.method === 'GET' && url.pathname === '/api/booking/today') {
          if (url.searchParams.get('error') === '1') {
            return sendJson(res, 500, { error: 'Не удалось получить текущую дату с сервера' });
          }
          return sendJson(res, 200, TODAY);
        }

        if (req.method === 'GET' && url.pathname === '/api/slots') {
          const day = Number(url.searchParams.get('day'));
          const month = Number(url.searchParams.get('month'));
          const year = Number(url.searchParams.get('year'));

          if (
            url.searchParams.get('error') === '1' ||
            Number.isNaN(day) ||
            Number.isNaN(month) ||
            Number.isNaN(year) ||
            day < 1 ||
            day > 31 ||
            month < 0 ||
            month > 11
          ) {
            return sendJson(res, 500, { error: 'Не удалось загрузить слоты времени для выбранной даты' });
          }

          const slots = getSlotsByDate(day, month);
          return sendJson(res, 200, {
            date: { day, month, year },
            slots,
          });
        }

        return sendJson(res, 404, { error: 'API endpoint not found' });
      });
    },
  };
}
