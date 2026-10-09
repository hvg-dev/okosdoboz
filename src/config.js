export function normalizePrefix(value, origin) {
  if (typeof value !== 'string' || !value || /[%\\?#]/.test(value) || value.startsWith('//')) {
    throw new Error('Érvénytelen feladatprefix.');
  }
  if (!value.startsWith('/') && !/^https?:\/\//.test(value)) {
    throw new Error('A prefix gyökérútvonal vagy azonos originű URL legyen.');
  }
  if (value.split('/').some(segment => segment === '.' || segment === '..')) {
    throw new Error('A prefix nem tartalmazhat pontszegmenst.');
  }
  const url = new URL(value, origin);
  if (url.origin !== origin || url.username || url.password || url.pathname === '/') {
    throw new Error('A feladatok csak ugyanazon originről tölthetők be.');
  }
  return url.pathname.replace(/\/+$/, '') + '/';
}

export function validateConfig(input, origin) {
  const keys = ['lessonsPrefix', 'defaultLessonId', 'supportedLessonIds', 'loadTimeoutMs'];
  if (!input || typeof input !== 'object' || Object.keys(input).some(key => !keys.includes(key))) {
    throw new Error('Érvénytelen keretkonfiguráció.');
  }
  const ids = input.supportedLessonIds;
  if (!Array.isArray(ids) || !ids.length || ids.some(id => typeof id !== 'string' || !/^[1-9]\d{0,11}$/.test(id)) || new Set(ids).size !== ids.length || !ids.includes(input.defaultLessonId)) {
    throw new Error('Érvénytelen támogatott feladatlista.');
  }
  if (!Number.isInteger(input.loadTimeoutMs) || input.loadTimeoutMs < 1000 || input.loadTimeoutMs > 120000) {
    throw new Error('Érvénytelen betöltési időkorlát.');
  }
  return { ...input, lessonsPrefix: normalizePrefix(input.lessonsPrefix, origin) };
}

export function selectLesson(config, search) {
  const params = new URLSearchParams(search);
  if ([...params.keys()].some(key => key !== 'lesson') || params.getAll('lesson').length > 1) {
    throw new Error('Csak egy lesson paraméter használható.');
  }
  const lessonId = params.has('lesson') ? params.get('lesson') : config.defaultLessonId;
  if (!config.supportedLessonIds.includes(lessonId)) throw new Error('Ismeretlen feladat.');
  return lessonId;
}

export function lessonUrls(config, lessonId, origin) {
  if (!config.supportedLessonIds.includes(lessonId)) throw new Error('Ismeretlen feladat.');
  const base = new URL(config.lessonsPrefix, origin);
  return {
    bootstrap: new URL('lib/okosdoboz.js', base).href,
    userConfig: new URL('lib/odconfig_user.js', base).href,
    index: new URL(`${lessonId}/${lessonId}/index.js`, base).href,
    library: new URL(`${lessonId}/lib/`, base).pathname,
    taskRoot: new URL(`${lessonId}/`, base).href
  };
}